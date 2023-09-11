import PublicDateRangePicker, { DateRange, PickerType } from '@components/publicDateRangePicker/comp'
import { dispatchGetActiveCustomers, fetchActiveCustomers } from '@features/actions/customers'
import { dispatchGetSubscriptionsInvoices, fetchSubscriptionsInvoices } from '@features/actions/subscriptionInvoices'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { AuthState } from '@features/reducers/auth'
import { Customer } from '@features/reducers/customers'
import { ActiveCustomersListState } from '@features/reducers/customers/active'
import { SubscriptionInvoice, SubscriptionInvoicesListState } from '@features/reducers/subscriptionInvoices'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { User } from '@utils/types'
import { Divider, Segmented, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import ViewSubscriptionInvoiceQrCode from './components/viewQr/comp'
import { PrintSubInvoice } from './components/print'
import { SegmentedValue } from 'antd/es/segmented'
import { ActiveInternetServiceListState } from '@features/reducers/internetServices/active'
import { dispatchGetActiveInternetServices, fetchActiveInternetServices } from '@features/actions/internetServices'
import { InternetService } from '@features/reducers/internetServices'
import { CollectSubscriptionInvoice } from './components/collectNow'
import SubscriptionInvoicePrintHistory from './components/printHistory/comp'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

const SubscriptionInvoicesList = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const subscriptionInvoicesList = useSelector((state: SubscriptionInvoicesListState) => state.subscriptionInvoicesList)
    const activeCustomersList = useSelector((state: ActiveCustomersListState) => state.activeCustomersList)
    const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
    const activeInternetServices = useSelector((state: ActiveInternetServiceListState) => state.activeInternetServicesList)
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

    // state
    const [loading, setLoading] = useState<boolean>(true)
    const [dateRange, setDateRange] = useState<DateRange>({
        start: dayjs().startOf('month').toDate(),
        end: dayjs().toDate(),
    })
    const [fieldType, setFieldType] = useState<SegmentedValue>('Invoice Date')

    // picker
    const [type, setType] = useState<PickerType>('month');

    const fetchSI = async (params: DateRange) => {
        fetchSubscriptionsInvoices(token, params).then((res: SubscriptionInvoice[]) => {
            dispatch(dispatch(dispatchGetSubscriptionsInvoices(res)))
        })
    }

    useEffect(() => {
        const params = {
            start: dateRange.start,
            end: dateRange.end,
            fieldType
        }
        fetchSI(params)

        fetchUsersSelection(token).then((res: any) => {
            dispatch(dispatchGetUsersSelection(res))
        })

        fetchActiveCustomers(token).then((res: Customer[]) => {
            dispatch(dispatchGetActiveCustomers(res))
        })

        fetchActiveInternetServices(token).then((res: InternetService[]) => {
            dispatch(dispatchGetActiveInternetServices(res))
        })

        setLoading(false)
    }, [])

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const params = {
                start: dateRange.start,
                end: dateRange.end,
                fieldType
            }
            fetchSI(params)
            setLoading(false)
        }, 200)
    }, [dateRange, fieldType])

    useEffect(() => {
        socketProvider.on('getSubscriptionInvoices_to_client', async function ({
            userId
        }) {
            if (currentUser?._id !== userId) {
                const params = {
                    start: dateRange.start,
                    end: dateRange.end,
                    fieldType
                }
                await fetchSI(params)
            }
        })

        return () => {
            socketProvider.off("getSubscriptionInvoices_to_client", fetchSI)
        }
    }, [])

    // filters
    const filtersNames = activeCustomersList?.map((customer: Customer) => (
        { text: `${customer.fullName} | ${customer.arabicName}`, value: `${customer.fullName} | ${customer.arabicName}` }
    ))
    const filteredPhoneNumbers = activeCustomersList?.reduce((uniqueCustomers: Customer[], customer: Customer) => {
        if (!uniqueCustomers.some((uniqueCustomer) => uniqueCustomer.phoneNumber === customer.phoneNumber)) {
            uniqueCustomers.push(customer)
        }
        return uniqueCustomers
    }, [])
    const filtersPhoneNumbers = filteredPhoneNumbers?.map((customer: Customer) => (
        { text: customer.phoneNumber, value: customer.phoneNumber }
    ))
    const filtersAccountNames = activeCustomersList?.map((customer: Customer) => (
        { text: customer.accountName, value: customer.accountName }
    ))
    const filtersInternetS = activeInternetServices?.map((service) => (
        {
            text: service.service,
            value: service.service
        }
    ))
    const filtersPaymentStatus = [
        {
            text: 'Paid',
            value: 'paid'
        },
        {
            text: 'Not-Paid',
            value: 'unPaid'
        }
    ]
    const filterUsers = usersSelection?.map((user: User) => (
        {
            text: user?.name,
            value: user?.name,
        }
    ))
    const filtersSerialNumber = subscriptionInvoicesList?.map((invoice: SubscriptionInvoice) => (
        {
            text: invoice.serialNumber,
            value: invoice.serialNumber
        }
    ))

    const columns: ColumnsType<any> = [
        {
            title: 'Customer',
            key: 'customerFullName',
            dataIndex: 'customer',
            render: (_, record: SubscriptionInvoice) => (
                <a href={`/customers/info/${record.customer._id}`} target='_blank'>
                    {record?.customer.fullName}
                </a>
            ),
            fixed: 'left',
            filterSearch: true,
            onFilter: (value: any, record: SubscriptionInvoice) => (
                `${record?.customer.fullName} | ${record?.customer.arabicName}` === value
            ),
            filters: filtersNames,
            sorter: (a: SubscriptionInvoice, b: SubscriptionInvoice) => a.customer.fullName.length - b.customer.fullName.length
        },

        {
            title: 'Phone No.',
            key: 'customerPhoneNumber',
            dataIndex: 'customer',
            render: (customer) => <a>{customer?.phoneNumber}</a>,
            filterSearch: true,
            onFilter: (value: any, record: SubscriptionInvoice) => record?.customer.phoneNumber === value,
            filters: filtersPhoneNumbers,
        },
        {
            title: 'Service',
            key: 'service',
            dataIndex: 'service',
            render: (service) => service?.service,
            filters: filtersInternetS,
            filterSearch: true,
            onFilter: (value: any, record: SubscriptionInvoice) => record?.service.service === value,
        },
        {
            title: 'Account',
            key: 'accountName',
            dataIndex: 'customer',
            render: (customer) => customer?.accountName,
            filters: filtersAccountNames,
            filterSearch: true,
            onFilter: (value: any, record: SubscriptionInvoice) => record?.customer.accountName === value,
        },
        {
            title: 'Serial Number',
            key: 'serialNumber',
            dataIndex: 'serialNumber',
            filters: filtersSerialNumber,
            filterSearch: true,
            onFilter: (value: any, record: SubscriptionInvoice) => record?.serialNumber === value,
        },
        {
            title: 'Status',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            filters: filtersPaymentStatus,
            filterSearch: true,
            onFilter: (value: any, record: SubscriptionInvoice) => record?.paymentStatus === value,
            render: (_, record: SubscriptionInvoice) => (
                record?.paymentStatus === 'paid' ?
                    <Tag color='green'>Paid</Tag> :
                    <Tag color='red'>Not Paid</Tag>
            ),
        },
        {
            title: 'Payment Date',
            key: 'paymentDate',
            dataIndex: 'paymentDate',
            render: (paymentDate) => paymentDate ? new Date(paymentDate).toLocaleDateString('en-GB') : '------',
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.paymentDate as string).getTime();
                const dateB = new Date(b.paymentDate as string).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Collector',
            key: 'collector',
            dataIndex: 'collector',
            filterSearch: true,
            onFilter: (value: any, record: any) => record?.collector?.name === value,
            filters: filterUsers,
            render: (collector) => (
                collector?.name ? <a target='_blank' href={`/users/${collector?._id}`}>{collector?.name}</a>
                    : '------'
            )
        },
        {
            title: 'Month',
            key: 'invoiceMonth',
            dataIndex: 'invoiceMonth',
            render: (invoiceMonth) => <a>{invoiceMonth}</a>,
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.invoiceDate as string).getTime();
                const dateB = new Date(b.invoiceDate as string).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Printed By',
            key: 'printedBy',
            dataIndex: 'printedBy',
            filterSearch: true,
            onFilter: (value: any, record: any) => record?.printedBy?.name === value,
            filters: filterUsers,
            render: (printedBy) => (
                printedBy?.name ? <a target='_blank' href={`/users/${printedBy?._id}`}>{printedBy?.name}</a>
                    : '------'
            )
        },
        {
            title: 'Printed At',
            key: 'printDate',
            dataIndex: 'printDate',
            render: (printDate) => printDate ? new Date(printDate).toLocaleDateString('en-GB') : '------',
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.printDate as string).getTime();
                const dateB = new Date(b.printDate as string).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Entry Date',
            key: 'createdAt',
            dataIndex: 'createdAt',
            render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : '-----',
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.createdAt as string).getTime();
                const dateB = new Date(b.createdAt as string).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: '_id',
            render: (_, record: SubscriptionInvoice) => (
                <Space>
                    <CollectSubscriptionInvoice invoice={record} subscriptionInvoicesList={subscriptionInvoicesList} />
                    <SubscriptionInvoicePrintHistory id={record._id} />
                    <ViewSubscriptionInvoiceQrCode invoiceId={record._id} />
                    <PrintSubInvoice invoice={record} subscriptionInvoicesList={subscriptionInvoicesList} />
                </Space>
            )
        }
    ]

    const pageSize = () => {
        const totalSize = subscriptionInvoicesList?.length
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
                columns={columns}
                dataSource={subscriptionInvoicesList}
                rowKey={'_id'}
                bordered
                scroll={{ x: 1400, }}
                pagination={{
                    showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
                    pageSizeOptions: subscriptionInvoicesList?.length >= 10 ?
                        [...pageSize(), subscriptionInvoicesList?.length] : [...pageSize()],
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
                            Subscription Invoices
                        </div>

                        <Space>
                            <div>
                                Total: {subscriptionInvoicesList?.length}
                            </div>

                            <Divider type='vertical' />

                            <Segmented
                                options={['Invoice Date', 'Payment Date', 'Entry Date']}
                                value={fieldType}
                                onChange={(e: SegmentedValue) => setFieldType(e)}
                            />

                            <PublicDateRangePicker
                                setDateRange={setDateRange}
                                dateRange={dateRange}
                                type={type}
                                setType={setType}
                            />
                        </Space>
                    </div>
                )}
            />
        </>
    )
}

export default SubscriptionInvoicesList