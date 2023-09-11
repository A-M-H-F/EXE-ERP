import { CustomerSubscription } from '@features/reducers/customerSubscriptions'
import { InternetService } from '@features/reducers/internetServices'
import { Card, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'

type CustomerSubscriptionsHistoryProps = {
    history: any,
    activeInternetServicesList: InternetService[],
    usersSelection: any
}

const CustomerSubscriptionsHistory = ({ history, usersSelection, activeInternetServicesList }: CustomerSubscriptionsHistoryProps) => {
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
        <Card
            hoverable
        >
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
                                    fontSize: '20px'
                                }}
                            >
                                Subscriptions History
                            </Typography>

                            <div>
                                Total: {history?.length}
                            </div>
                        </div>
                    </>
                )}
            />
        </Card>
    )
}

export default CustomerSubscriptionsHistory