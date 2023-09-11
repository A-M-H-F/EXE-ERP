import { UserOutlined, WifiOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetActiveInternetServices, fetchActiveInternetServices } from '@features/actions/internetServices'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { CustomerSubscription } from '@features/reducers/customerSubscriptions'
import { InternetService } from '@features/reducers/internetServices'
import { ActiveInternetServiceListState } from '@features/reducers/internetServices/active'
import { TokenState } from '@features/reducers/token'
import { UsersSelectionListState } from '@features/reducers/usersSelection'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Form, Input, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const CustomerSubscriptionHistoryPage = () => {
  const { customerId } = useParams()
  const { message: messageApi } = App.useApp()
  const token = useSelector((state: TokenState) => state.token)
  const dispatch = useDispatch()
  const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
  const activeInternetServicesList = useSelector((state: ActiveInternetServiceListState) => state.activeInternetServicesList)
  const { socketProvider } = useSocket()

  // state
  const [info, setInfo] = useState<CustomerSubscription>()
  const [history, setHistory] = useState<any>(null)

  const fetchSub = async () => {
    try {
      const { data } = await apiService.GET(`/subscription/${customerId}`, token)

      setInfo(data)

      const sorter = (a: any, b: any) => {
        const dateA = new Date(a.changeDate as string).getTime();
        const dateB = new Date(b.changeDate as string).getTime();
        return dateB - dateA;
      }

      const sortHistory = data?.serviceHistory?.sort((a: any, b: any) => sorter(a, b))

      setHistory(sortHistory)

    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error?.response?.data?.message
      })
    }
  }

  useEffect(() => {
    if (customerId && customerId !== '') {
      fetchSub()

      fetchActiveInternetServices(token).then((res: InternetService[]) => {
        dispatch(dispatchGetActiveInternetServices(res))
      })

      fetchUsersSelection(token).then((res: any) => {
        dispatch(dispatchGetUsersSelection(res))
      })
    }
  }, [customerId])

  useEffect(() => {
    socketProvider.on('getCustomerSubscription_to_client', async function ({
      customer
    }) {
      if (customerId && customerId === customer) {
        await fetchSub()
      }
    });

    return () => {
      socketProvider.off("getCustomerSubscription_to_client", fetchSub);
    }
  }, [])

  const filtersInternetServices = activeInternetServicesList?.map((is: InternetService) => (
    { text: is.service, value: is.service }
  ))
  const filterUsers = usersSelection?.map((user: any) => (
    {
      text: user?.name,
      value: user?.name
    }
  ))

  const columns: ColumnsType<any> = [
    {
      title: 'Last Service',
      key: 'service',
      dataIndex: 'service',
      render: (service) => service.service,
      filterSearch: true,
      filters: filtersInternetServices,
      onFilter: (value, record: CustomerSubscription) => record.service.service === value
    },
    {
      title: 'Changed By',
      key: 'changedBy',
      dataIndex: 'changedBy',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.changedBy?.name === value,
      filters: filterUsers,
      render: (user) => <a target='_blank' href={`/users/${user?._id}`}>{user?.name}</a>
    },
    {
      title: 'Change Date',
      key: 'changeDate',
      dataIndex: 'changeDate',
      render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.changeDate as string).getTime();
        const dateB = new Date(b.changeDate as string).getTime();
        return dateA - dateB;
      }
    },
  ]

  const updatedColumns = [...columns]

  const pageSize = () => {
    const totalSize = history?.length
    const options = []

    for (let start = 10; start <= totalSize;) {
      options.push(start);
      if (start >= 50) {
        start += 50;
      } else if (start >= 30) {
        start += 20;
      } else {
        start += 10;
      }
    }

    return options
  }

  return (
    <>
      <Table
        loading={!history && history?.length <= 0}
        columns={updatedColumns}
        dataSource={history}
        rowKey={'_id'}
        bordered
        scroll={{ x: 1400, }}
        pagination={{
          showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
          pageSizeOptions: history?.length >= 10 ? [...pageSize(), history?.length]
            : [...pageSize()],
          showSizeChanger: true
        }}
        title={() => (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                style={{
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                Customer Subscriptions History
              </Typography>

              <div>
                Total: {history?.length}
              </div>
            </div>

            <Form
              layout='inline'
              style={{
                marginTop: '0.5em',
              }}
            >
              <Form.Item
                label='Customer'
              >
                <a href={`/customers/info/${info?.customer?._id}`} target='_blank'>
                  <Input
                    readOnly
                    value={info?.customer?.fullName}
                    style={{
                      maxWidth: 'max-content',
                      color: 'blue',
                      cursor: 'pointer'
                    }}
                    prefix={<UserOutlined />}
                  />
                </a>
              </Form.Item>

              <Form.Item label='Current Service'>
                <Input
                  readOnly
                  value={info?.customer?.service?.service}
                  style={{
                    maxWidth: 'max-content',
                    color: 'blue'
                  }}
                  prefix={<WifiOutlined />}
                />
              </Form.Item>
            </Form>
          </>
        )}
      />
    </>
  )
}

export default CustomerSubscriptionHistoryPage