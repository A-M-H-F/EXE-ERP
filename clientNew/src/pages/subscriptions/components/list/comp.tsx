import { HistoryOutlined } from '@ant-design/icons'
import { dispatchGetCustomersSubscriptions, fetchCustomersSubscriptions } from '@features/actions/customerSubscriptions'
import { dispatchGetActiveCustomers, fetchActiveCustomers } from '@features/actions/customers'
import { dispatchGetActiveInternetServices, fetchActiveInternetServices } from '@features/actions/internetServices'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { AuthState } from '@features/reducers/auth'
import { CustomerSubscription, CustomersSubscriptionListState } from '@features/reducers/customerSubscriptions'
import { Customer } from '@features/reducers/customers'
import { ActiveCustomersListState } from '@features/reducers/customers/active'
import { InternetService } from '@features/reducers/internetServices'
import { ActiveInternetServiceListState } from '@features/reducers/internetServices/active'
import { TokenState } from '@features/reducers/token'
import { UsersSelectionListState } from '@features/reducers/usersSelection'
import { useSocket } from '@socket/provider/socketProvider'
import { Space, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const SubscriptionsList = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const customersSubscriptionList = useSelector((state: CustomersSubscriptionListState) => state.customersSubscriptionList)
    const activeInternetServicesList = useSelector((state: ActiveInternetServiceListState) => state.activeInternetServicesList)
    const activeCustomersList = useSelector((state: ActiveCustomersListState) => state.activeCustomersList)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)

    const [loading, setLoading] = useState<boolean>(true)

    const fetchSubs = async () => {
        fetchCustomersSubscriptions(token).then((res: CustomerSubscription[]) => {
            dispatch(dispatchGetCustomersSubscriptions(res))
        })
    }

    useEffect(() => {
        fetchSubs()

        fetchActiveInternetServices(token).then((res: InternetService[]) => {
            dispatch(dispatchGetActiveInternetServices(res))
        })

        fetchActiveCustomers(token).then((res: Customer[]) => {
            dispatch(dispatchGetActiveCustomers(res))
        })

        fetchUsersSelection(token).then((res: any) => {
            dispatch(dispatchGetUsersSelection(res))
        })

        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    useEffect(() => {
        socketProvider.on('getCustomersSubscriptions_to_client', async function ({
            userId
        }) {
            if (currentUser !== userId) {
                await fetchSubs()
            }
        });

        return () => {
            socketProvider.off("getCustomersSubscriptions_to_client", fetchSubs);
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

    const filtersCustomers = activeCustomersList?.map((customer: Customer) => (
        {
            text: customer.fullName,
            value: customer.fullName
        }
    ))

    const columns: ColumnsType<any> = [
        {
            title: 'Customer',
            key: 'customer',
            dataIndex: 'customer',
            render: (customer: Customer) => <a href={`/customers/info/${customer._id}`} target='_blank'>{customer.fullName}</a>,
            filterSearch: true,
            filters: filtersCustomers,
            onFilter: (value, record: CustomerSubscription) => record.customer.fullName === value,
            fixed: 'left',
        },
        {
            title: 'Current Service',
            key: 'customer',
            dataIndex: 'service',
            render: (_, record: CustomerSubscription) => (
                record.customer.service.service
            ),
            filterSearch: true,
            filters: filtersInternetServices,
            onFilter: (value, record: CustomerSubscription) => record.service.service === value
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
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: '_id',
            render: (_: any, subscription: CustomerSubscription) => (
                <Space>
                    <Tooltip title='View Subscription History'>
                        <a href={`/subscriptions/history/${subscription.customer._id}`} target='_blank'>
                            <HistoryOutlined style={{ color: 'blue' }} />
                        </a>
                    </Tooltip>
                </Space>
            ),
        }
    ]

    const updatedColumns = [...columns]

    const pageSize = () => {
        const totalSize = customersSubscriptionList?.length
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
                loading={loading}
                columns={updatedColumns}
                dataSource={customersSubscriptionList}
                rowKey={'_id'}
                bordered
                scroll={{ x: 1400, }}
                pagination={{
                    showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
                    pageSizeOptions: customersSubscriptionList?.length >= 10 ? [...pageSize(), customersSubscriptionList?.length]
                        : [...pageSize()],
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
                            Customers Subscriptions
                        </div>

                        <div>
                            Total: {customersSubscriptionList?.length}
                        </div>
                    </div>
                )}
            />
        </>
    )
}

export default SubscriptionsList