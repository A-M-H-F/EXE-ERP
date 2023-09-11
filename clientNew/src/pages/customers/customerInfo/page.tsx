import apiService from '@api/index'
import { Customer } from '@features/reducers/customers'
import { TokenState } from '@features/reducers/token'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { App, Card, Divider, Empty, Skeleton, Table } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Location } from '@features/reducers/locations'
import { ActiveLocationsListState } from '@features/reducers/locations/active'
import { ActiveInternetServiceListState } from '@features/reducers/internetServices/active'
import { dispatchGetActiveLocations, fetchActiveLocations } from '@features/actions/locations'
import { dispatchGetActiveInternetServices, fetchActiveInternetServices } from '@features/actions/internetServices'
import { InternetService } from '@features/reducers/internetServices'
import { useDispatch } from 'react-redux'
import { UpdateCustomer } from './components/update'
import { AuthState } from '@features/reducers/auth'
import { useSocket } from '@socket/provider/socketProvider'
import { CustomerSubscriptionsHistory } from './components/subscriptionsHistory'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { CustomerSubscriptionInvoices } from './components/subscriptionInvoices'
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import { DateRange } from '@components/publicDateRangePicker/comp'
import { SegmentedValue } from 'antd/es/segmented'
import dayjs from 'dayjs'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

const CustomerInfoPage = () => {
    useDocumentMetadata('EX - Customer Info', 'Extreme Engineering - Customers Info')

    // state
    const { customerId } = useParams()
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()

    const [customerInfo, setCustomerInfo] = useState<Customer>()
    const [logs, setLogs] = useState<Customer[]>([])
    const [history, setHistory] = useState<any | null>(null)

    // r states
    const activeLocationsList = useSelector((state: ActiveLocationsListState) => state.activeLocationsList)
    const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
    const activeInternetServicesList = useSelector((state: ActiveInternetServiceListState) => state.activeInternetServicesList)

    const fetchCustomerInfo = async () => {
        try {
            const { data } = await apiService.GET(`/customer/${customerId}`, token)

            setCustomerInfo(data)

            setLogs([data])

        } catch (error: any) {
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    const fetchServiceHistory = async () => {
        try {
            const { data } = await apiService.GET(`/subscription/${customerId}`, token)

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

    // subscription invoices
    const [invoices, setInvoices] = useState<SubscriptionInvoice[] | null>()
    const [subscriptionInvoicesLoading, setSubscriptionInvoicesLoading] = useState<boolean>(true)
    const [dateRange, setDateRange] = useState<DateRange>({
        start: dayjs().startOf('month').toDate(),
        end: dayjs().toDate(),
    })
    const [fieldType, setFieldType] = useState<SegmentedValue>('Invoice Date')

    const fetchSubscriptionInvoices = async (params: DateRange) => {
        try {
            const { data } = await apiService.GETWithParams(`/subscription-invoice/customer/${customerId}`, params, token)

            setInvoices(data)

        } catch (error: any) {
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        setSubscriptionInvoicesLoading(true)
        setTimeout(() => {
            const params = {
                start: dateRange.start,
                end: dateRange.end,
                fieldType
            }
            fetchSubscriptionInvoices(params)
            setSubscriptionInvoicesLoading(false)
        }, 200)
    }, [dateRange, fieldType])

    useEffect(() => {
        socketProvider.on('updateCustomer_to_client', async function ({
            userId
        }) {
            if (currentUser?._id !== userId) {
                await fetchCustomerInfo()
                await fetchServiceHistory()
            }
        })

        socketProvider.on('getCustomer_to_client', async function ({
            customer
        }) {
            if (customer === customerId) {
                await fetchCustomerInfo()
                await fetchServiceHistory()
            }
        })

        socketProvider.on('getCustomerSubscription_to_client', async function ({
            customer
        }) {
            if (customerId && customerId === customer) {
                await fetchServiceHistory()
            }
        })

        return () => {
            socketProvider.off("updateCustomer_to_client", fetchCustomerInfo)
            socketProvider.off("updateCustomer_to_client", fetchServiceHistory)
            socketProvider.off("getCustomerSubscription_to_client", fetchServiceHistory)
            socketProvider.off("getCustomer_to_client", fetchCustomerInfo)
            socketProvider.off("getCustomer_to_client", fetchServiceHistory)
        }
    }, [socketProvider])

    useEffect(() => {
        fetchCustomerInfo()
        const params = {
            start: dateRange.start,
            end: dateRange.end,
            fieldType
        }
        fetchSubscriptionInvoices(params)

        setSubscriptionInvoicesLoading(false)

        fetchServiceHistory()

        fetchActiveLocations(token).then((res: Location[]) => {
            dispatch(dispatchGetActiveLocations(res))
        })

        fetchActiveInternetServices(token).then((res: InternetService[]) => {
            dispatch(dispatchGetActiveInternetServices(res))
        })

        fetchUsersSelection(token).then((res: any) => {
            dispatch(dispatchGetUsersSelection(res))
        })

        setTimeout(() => {
            setLoading(false)
        }, 600)
    }, [])

    return (
        <Skeleton loading={loading} active avatar paragraph={{ rows: 20 }}>
            {customerInfo ?
                <>
                    <UpdateCustomer
                        customerInfo={customerInfo}
                        activeLocationsList={activeLocationsList}
                        activeInternetServicesList={activeInternetServicesList}
                        setCustomerInfo={setCustomerInfo}
                    />

                    <Divider
                        style={{
                            backgroundColor: 'blue'
                        }}
                    />

                    <Card
                        title='Logs'
                    >
                        <Table dataSource={logs} bordered rowKey={'_id'}>
                            <Table.Column<Customer>
                                key="updatedBy" title="Last Updated By" dataIndex="updatedBy"
                                render={(updatedBy) => (
                                    <a
                                        href={`/users/${updatedBy?._id}`}
                                        target='_blank'
                                    >
                                        {updatedBy?.name}
                                    </a>
                                )}
                            />
                            <Table.Column<Customer>
                                key="updatedAt" title="Last Updated At" dataIndex="updatedAt"
                                render={(updatedAt) => updatedAt ? new Date(updatedAt).toLocaleDateString('en-GB') : '------'}
                            />
                            <Table.Column<Customer>
                                key="createdBy" title="Entry By" dataIndex="createdBy"
                                render={(createdBy) => (
                                    <a
                                        href={`/users/${createdBy?._id}`}
                                        target='_blank'
                                    >
                                        {createdBy?.name}
                                    </a>
                                )}
                            />
                            <Table.Column<Customer>
                                key="createdAt" title="Entry At" dataIndex="createdAt"
                                render={(createdAt) => createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : '------'}
                            />
                        </Table>

                    </Card>

                    <Divider
                        style={{
                            backgroundColor: 'blue'
                        }}
                    />

                    {invoices &&
                        <CustomerSubscriptionInvoices
                            invoices={invoices}
                            loading={subscriptionInvoicesLoading}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            fieldType={fieldType}
                            setFieldType={setFieldType}
                            usersSelection={usersSelection}
                            activeInternetServices={activeInternetServicesList}
                        />
                    }

                    <Divider
                        style={{
                            backgroundColor: 'blue'
                        }}
                    />

                    {history &&
                        <CustomerSubscriptionsHistory
                            history={history}
                            usersSelection={usersSelection}
                            activeInternetServicesList={activeInternetServicesList}
                        />
                    }
                </>
                :
                <Empty />
            }
        </Skeleton>
    )
}

export default CustomerInfoPage