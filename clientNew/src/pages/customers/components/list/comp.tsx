import { dispatchGetCustomers, fetchCustomers } from '@features/actions/customers'
import { dispatchGetActiveLocations, dispatchGetLocations, fetchActiveLocations, fetchLocations } from '@features/actions/locations'
import { AuthState } from '@features/reducers/auth'
import { Customer, CustomerListState } from '@features/reducers/customers'
import { Location, LocationsListState } from '@features/reducers/locations'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Divider, Space, Switch, Tooltip, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { CustomerStatus } from '../status'
import { ExpandedRowRender } from './expandedRow'
import { EyeOutlined, HistoryOutlined } from '@ant-design/icons'
import { UpdateCustomerBuildingPicture } from '../updateBuildingPic'
import { UpdateCustomerInfo } from '../update'
import { ActiveLocationsListState } from '@features/reducers/locations/active'
import { ActiveInternetServiceListState } from '@features/reducers/internetServices/active'
import { InternetService } from '@features/reducers/internetServices'
import { dispatchGetActiveInternetServices, fetchActiveInternetServices } from '@features/actions/internetServices'
import { CustomerService } from '../service'

const CustomersList = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const customersList = useSelector((state: CustomerListState) => state.customersList)
    const locationsList = useSelector((state: LocationsListState) => state.locationsList)
    const activeLocationsList = useSelector((state: ActiveLocationsListState) => state.activeLocationsList)
    // const usersSelection = useSelector((state: any) => state.usersSelection)
    const activeInternetServicesList = useSelector((state: ActiveInternetServiceListState) => state.activeInternetServicesList)
    const { user: currentUser, role } = useSelector((state: AuthState) => state.auth)
    const canUpdate = hasPermission(role, 'Customers', 'Update')

    const fetchCustomersEvent = async () => {
        fetchCustomers(token).then((res: Customer[]) => {
            dispatch(dispatchGetCustomers(res))
        })
    }

    useEffect(() => {
        fetchCustomersEvent()

        fetchLocations(token).then((res: Location[]) => {
            dispatch(dispatchGetLocations(res))
        })

        fetchActiveLocations(token).then((res: Location[]) => {
            dispatch(dispatchGetActiveLocations(res))
        })


        fetchActiveInternetServices(token).then((res: InternetService[]) => {
            dispatch(dispatchGetActiveInternetServices(res))
        })
    }, [])

    useEffect(() => {
        socketProvider.on('getCustomers_to_client', async function ({
            userId
        }) {
            if (currentUser?._id !== userId) {
                await fetchCustomersEvent()
            }
        })

        socketProvider.on('updateCustomer_to_client', async function ({
            userId
        }) {
            if (currentUser?._id === userId) {
                await fetchCustomersEvent()
            }
        })

        return () => {
            socketProvider.off("getCustomers_to_client", fetchCustomersEvent)
            socketProvider.off("updateCustomer_to_client", fetchCustomersEvent)
        }
    }, [socketProvider])

    // filters
    const servicesFilter = activeInternetServicesList?.map((service) => (
        {
            text: service.service,
            value: service.service
        }
    ))
    const filtersNames = customersList?.map((customer: Customer) => (
        { text: customer.fullName, value: customer.fullName }
    ))
    const filtersArabicNames = customersList?.map((customer: Customer) => (
        { text: customer.arabicName, value: customer.arabicName }
    ))
    const filteredAccountNames = customersList?.filter((customer: Customer) => customer.accountName)
    const filtersAccountNames = filteredAccountNames?.map((customer: Customer) => (
        { text: customer.accountName, value: customer.accountName }
    ))
    const filtersIpAddress = customersList?.map((customer: Customer) => (
        { text: customer.ipAddress, value: customer.ipAddress }
    ))
    const filtersMacAddress = customersList?.map((customer: Customer) => (
        { text: customer.macAddress, value: customer.macAddress }
    ))
    const filteredPhoneNumbers = customersList?.reduce((uniqueCustomers: Customer[], customer: Customer) => {
        if (!uniqueCustomers.some((uniqueCustomer) => uniqueCustomer.phoneNumber === customer.phoneNumber)) {
            uniqueCustomers.push(customer)
        }
        return uniqueCustomers
    }, [])
    const filtersPhoneNumbers = filteredPhoneNumbers?.map((customer: Customer) => (
        { text: customer.phoneNumber, value: customer.phoneNumber }
    ))
    const filtersCities = locationsList?.map((location: Location) => (
        { text: location.city, value: location.city }
    ))
    const filterZones = locationsList
        .flatMap((location: Location) =>
            location.zones.map((zone) => ({
                text: zone.name,
                value: zone.name,
            }))
        )
        .reduce((uniqueZones: any, zone: any) => {
            const existingZone = uniqueZones.find((uniqueZone: any) => uniqueZone.value === zone.value);

            if (!existingZone) {
                uniqueZones.push(zone)
            }

            return uniqueZones
        }, [])
    const filtersStreets = locationsList
        .flatMap((location: Location) =>
            location.zones.flatMap((zone) =>
                zone.streets.map((street) => ({
                    text: street.name,
                    value: street.name,
                }))
            )
        )
        .reduce((uniqueStreets: any, street: any) => {
            const existingStreet = uniqueStreets.find(
                (uniqueStreet: any) => uniqueStreet.value === street.value
            );

            if (!existingStreet) {
                uniqueStreets.push(street);
            }

            return uniqueStreets;
        }, [])
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
    // const filterUsers = usersSelection?.map((user: any, index: number) => (
    //     {
    //         text: user?.name,
    //         value: user?.name,
    //         key: index
    //     }
    // ))

    // table options
    const [enableGrouping, setEnableGrouping] = useState<boolean>(false)
    const [fixedHeader, setFixHeader] = useState<boolean>(false)

    const addressOptions: ColumnsType<any> = [
        {
            title: 'City',
            key: 'address',
            dataIndex: 'address',
            render: (address) => address?.city,
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record.address.city === value,
            filters: filtersCities,
        },
        {
            title: 'Zone',
            key: 'zone',
            dataIndex: 'address',
            render: (address) => address?.zone,
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record.address.zone === value,
            filters: filterZones,
        },
        {
            title: 'Street',
            key: 'street',
            dataIndex: 'address',
            render: (address) => address?.street,
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record.address.street === value,
            filters: filtersStreets,
        },
    ]

    const nameOptions: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'fullName',
            dataIndex: 'fullName',
            render: (_, record: Customer) => <a href={`/customers/info/${record._id}`} target='_blank'>{record.fullName}</a>,
            fixed: 'left',
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record?.fullName === value,
            filters: filtersNames,
            sorter: (a, b) => a.fullName.length - b.fullName.length,
        },
        {
            title: 'AR Name',
            key: 'arabicName',
            dataIndex: 'arabicName',
            render: (name) => <a>{name}</a>,
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record?.arabicName === value,
            filters: filtersArabicNames,
            sorter: (a, b) => a.arabicName.length - b.arabicName.length,
        },
    ]

    const columns: ColumnsType<any> = [
        ...(enableGrouping
            ? [
                {
                    title: 'Name',
                    fixed: true,
                    children: [
                        ...nameOptions
                    ]
                }
            ]
            : nameOptions
        ),
        {
            title: 'Phone No.',
            key: 'phoneNumber',
            dataIndex: 'phoneNumber',
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record.phoneNumber === value,
            filters: filtersPhoneNumbers,
        },
        {
            title: 'Internet Service',
            key: 'internetService',
            dataIndex: 'service',
            render: (_, record: Customer) => (
                canUpdate ?
                    <CustomerService
                        customersList={customersList}
                        id={record._id}
                        service={record?.service?._id}
                        activeInternetServicesList={activeInternetServicesList}
                    />
                    : record?.service?.service
            ),
            filters: servicesFilter,
            onFilter: (value: any, record: Customer) => record?.service?.service === value,
            filterSearch: true,
        },
        {
            title: 'Account',
            key: 'accountName',
            dataIndex: 'accountName',
            render: (accountName) => accountName ? accountName : '------',
            filterSearch: true,
            filters: filtersAccountNames,
            onFilter: (value, record: Customer) => record?.accountName === value,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, record) => (
                canUpdate ?
                    <CustomerStatus
                        status={record?.status}
                        id={record?._id}
                        customersList={customersList}
                    />
                    : record?.status
            ),
            filters: filtersStatus,
            onFilter: (value: any, record: any) => record?.status === value,
            filterSearch: true,
        },
        {
            title: 'Ip Address',
            key: 'ipAddress',
            dataIndex: 'ipAddress',
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record.ipAddress === value,
            filters: filtersIpAddress,
        },
        {
            title: 'Mac Address',
            key: 'macAddress',
            dataIndex: 'macAddress',
            filterSearch: true,
            onFilter: (value: any, record: Customer) => record.macAddress === value,
            filters: filtersMacAddress,
        },
        {
            title: 'Subscription Date',
            key: 'subscriptionDate',
            dataIndex: 'subscriptionDate',
            render: (date: Date) => <a>{new Date(date)?.toLocaleDateString('en-GB')}</a>,
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.subscriptionDate as string).getTime();
                const dateB = new Date(b.subscriptionDate as string).getTime();
                return dateA - dateB;
            }
        },
        ...(enableGrouping
            ? [
                {
                    title: 'Address',
                    children: [
                        ...addressOptions
                    ]
                }
            ]
            : addressOptions
        ),
        {
            title: 'Action',
            key: 'action',
            dataIndex: '_id',
            render: (_: any, customer: Customer) => (
                <Space>
                    <Typography.Link href={`/customers/info/${customer._id}`} target='_blank'>
                        <Tooltip title={'View Customer Info'}>
                            <EyeOutlined />
                        </Tooltip>
                    </Typography.Link>

                    <Tooltip title='View Subscription History'>
                        <a href={`/subscriptions/history/${customer._id}`} target='_blank'>
                            <HistoryOutlined style={{ color: 'blue' }} />
                        </a>
                    </Tooltip>

                    {canUpdate &&
                        <Space>
                            <UpdateCustomerInfo
                                customerInfo={customer}
                                customersList={customersList}
                                activeLocationsList={activeLocationsList}
                                activeInternetServicesList={activeInternetServicesList}
                            />

                            <UpdateCustomerBuildingPicture
                                customersList={customersList}
                                customerId={customer?._id}
                            />
                        </Space>
                    }
                </Space>
            ),
        },
    ]

    const updatedColumns = [...columns]

    const pageSize = () => {
        const totalSize = customersList?.length
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
                loading={customersList?.length <= 0}

                columns={updatedColumns}
                dataSource={customersList}
                expandable={{
                    expandedRowRender: (record) => <ExpandedRowRender record={record} enableGrouping={enableGrouping} />
                }}
                rowKey={'_id'}
                bordered
                scroll={{ x: 1400, y: fixedHeader ? '100vh' : 'auto' }}
                pagination={{
                    showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
                    pageSizeOptions: customersList?.length >= 10 ? [...pageSize(), customersList?.length] : [...pageSize()],
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
                            Customers
                        </div>

                        <Space>
                            Total: {customersList?.length}

                            <Divider type="vertical" />

                            <Tooltip title={'Grouping'}>
                                <Switch
                                    onChange={setEnableGrouping}
                                    checked={!!enableGrouping}
                                />
                            </Tooltip>

                            <Divider type="vertical" />

                            <Tooltip title={'Fixed Header'}>
                                <Switch checked={!!fixedHeader} onChange={setFixHeader} />
                            </Tooltip>
                        </Space>
                    </div>
                )}
            />
        </>
    )
}

export default CustomersList