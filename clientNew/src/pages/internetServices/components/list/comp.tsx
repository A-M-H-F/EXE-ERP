import { dispatchGetInternetServices, fetchInternetServices } from '@features/actions/internetServices'
import { dispatchGetISP, fetchISP } from '@features/actions/isp'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { AuthState } from '@features/reducers/auth'
import { InternetService, InternetServiceListState } from '@features/reducers/internetServices'
import { ISP, ISPListState } from '@features/reducers/isp'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { UpdateInternetService } from '../Update'
import { InternetServiceStatus } from '../Status'
import { UpdateInternetServiceIsp } from '../isp'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

const InternetServicesList = () => {
  const token = useSelector((state: TokenState) => state.token)
  const internetServicesList = useSelector((state: InternetServiceListState) => state.internetServicesList)
  const ispList = useSelector((state: ISPListState) => state.ispList)
  const filteredIspList = ispList?.filter((isp: ISP) => isp?.status === 'active')
  const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
  const { socketProvider } = useSocket()
  const dispatch = useDispatch()
  const { role, user: currentUser } = useSelector((state: AuthState) => state.auth)
  const canUpdate = hasPermission(role, 'Internet Service Providers', 'Update')

  const fetchInternetServicesList = async () => {
    fetchInternetServices(token).then((res: InternetService[]) => {
      dispatch(dispatchGetInternetServices(res))
    })
  }

  useEffect(() => {
    fetchInternetServicesList()

    fetchISP(token).then((res: ISP[]) => {
      dispatch(dispatchGetISP(res))
    })

    fetchUsersSelection(token).then((res: any) => {
      dispatch(dispatchGetUsersSelection(res))
    })
  }, [])

  useEffect(() => {
    socketProvider.on('getAllInternetServices_to_client', async function ({
      userId
    }) {
      if (currentUser?._id !== userId) {
        await fetchInternetServicesList()
      }
    });

    return () => {
      socketProvider.off("getAllInternetServices_to_client", fetchInternetServicesList);
    }
  }, [])

  // filters
  const filtersNames = internetServicesList?.map((is: InternetService) => (
    { text: is.name, value: is.name }
  ))
  const filterIsp = ispList?.map((isp: ISP) => (
    { text: isp.name, value: isp.name }
  ))
  const filterUsers = usersSelection?.map((user: any, index: number) => (
    {
      text: user?.name,
      value: user?.name,
      key: index
    }
  ))
  const filtersStatus = [
    {
      text: 'Active',
      value: 'active'
    },
    {
      text: 'In-Active',
      value: 'inactive'
    }
  ]

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      render: (name) => <a>{name}</a>,
      fixed: 'left',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.name === value,
      filters: filtersNames,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Service',
      key: 'service',
      dataIndex: 'service',
    },
    {
      title: 'ISP',
      key: 'isp',
      dataIndex: 'isp',
      render: (_, is) => (
        canUpdate ?
          <UpdateInternetServiceIsp
            isp={is?.isp?._id}
            id={is?._id}
            ispList={filteredIspList}
          />
          : is?.isp?.name
      ),
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.isp.name === value,
      filters: filterIsp,
    },
    {
      title: 'Cost',
      key: 'cost',
      dataIndex: 'cost',
      render: (cost) => <a>${cost}</a>,
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      render: (price) => <a>${price}</a>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Profit',
      key: 'profit',
      dataIndex: 'profit',
      render: (profit) => <a style={{ color: 'green' }}>${profit}</a>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, is) => (
        canUpdate ?
          <InternetServiceStatus
            status={is?.status}
            id={is?._id}
          />
          : is?.status
      ),
      onFilter: (value: any, record: any) => record?.status === value,
      filters: filtersStatus,
    },
    {
      title: 'Entry By',
      key: 'createdBy',
      dataIndex: 'createdBy',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.createdBy?.name === value,
      filters: filterUsers,
      render: (user) => <a target='_blank' href={`/users/${user?._id}`}>{user?.name}</a>
    },
    {
      title: 'Entry Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.createdAt as string).getTime();
        const dateB = new Date(b.createdAt as string).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Updated By',
      key: 'updatedBy',
      dataIndex: 'updatedBy',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.updatedBy?.name === value,
      filters: filterUsers,
      render: (user) => (
        user?.name ? <a target='_blank' href={`/users/${user?._id}`}>{user?.name}</a>
          : '------'
      )
    },
    {
      title: 'Update Date',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.updatedAt as string).getTime();
        const dateB = new Date(b.updatedAt as string).getTime();
        return dateA - dateB;
      },
    }
  ]

  const updatedColumns = [...columns]

  if (canUpdate) {
    updatedColumns.push(
      {
        title: 'Action',
        key: 'action',
        dataIndex: '_id',
        render: (_: any, interService: InternetService) => (
          <Space>
            <UpdateInternetService interService={interService} />

            {/* <>Delete</> */}
          </Space>
        ),
      }
    )
  }

  const pageSize = () => {
    const totalSize = internetServicesList?.length
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
        columns={updatedColumns}
        dataSource={internetServicesList}
        rowKey={'_id'}
        bordered
        scroll={{ x: 1400, }}
        pagination={{
          showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
          pageSizeOptions: internetServicesList?.length >= 10 ? [...pageSize(), internetServicesList?.length] : [...pageSize()],
          showSizeChanger: true
        }}
        title={() => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              Internet Services
            </div>

            <div>
              Total: {internetServicesList?.length}
            </div>
          </div>
        )}
      />
    </>
  )
}

export default InternetServicesList