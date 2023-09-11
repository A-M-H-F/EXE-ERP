import { Customer } from '@features/reducers/customers'
import { Divider, Table, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { BuildingImage } from '../../buildingPic'

// type FilteredUsers = {
//     text: string,
//     value: string,
// }

type ExpandedRowRender = {
    record: Customer,
    // filterUsers: FilteredUsers[],
    enableGrouping: boolean
}

const ExpandedRowRender = ({ record, enableGrouping }: ExpandedRowRender) => {
    const data = [record]

    const addressOptions: ColumnsType<any> = [
        {
            title: 'Building',
            dataIndex: 'address',
            key: 'building',
            render: (record) => record?.building
        },
        {
            title: 'Floor',
            dataIndex: 'address',
            key: 'floor',
            render: (record) => record?.floor
        },
        {
            title: 'Apartment',
            dataIndex: 'address',
            key: 'apartment',
            render: (record) => record?.apartment
        },
    ]

    const coordinatesOptions: ColumnsType<any> = [
        {
            title: 'Latitude',
            dataIndex: 'coordinates',
            key: 'latitude',
            render: (record) => record?.latitude
        },
        {
            title: 'Longitude',
            dataIndex: 'coordinates',
            key: 'longitude',
            render: (record) => record?.longitude
        },
    ]

    const logsOptions: ColumnsType<any> = [
        {
            title: 'Entry By',
            key: 'createdBy',
            dataIndex: 'createdBy',
            // filterSearch: true,
            // onFilter: (value: any, record: any) => record?.createdBy?.name === value,
            // filters: filterUsers,
            render: (user) => <a target='_blank' href={`/users/${user?._id}`}>{user?.name}</a>
        },
        {
            title: 'Entry Date',
            key: 'createdAt',
            dataIndex: 'createdAt',
            render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
            // sorter: (a: any, b: any) => {
            //     const dateA = new Date(a.createdAt as string).getTime();
            //     const dateB = new Date(b.createdAt as string).getTime();
            //     return dateA - dateB;
            // }
        },
        {
            title: 'Updated By',
            key: 'updatedBy',
            dataIndex: 'updatedBy',
            // filterSearch: true,
            // onFilter: (value: any, record: any) => record?.updatedBy?.name === value,
            // filters: filterUsers,
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
            // sorter: (a: any, b: any) => {
            //     const dateA = new Date(a.updatedAt as string).getTime();
            //     const dateB = new Date(b.updatedAt as string).getTime();
            //     return dateA - dateB;
            // },
        },
        {
            title: 'Building Image',
            dataIndex: 'address',
            key: 'buildingImage',
            render: (_, record: Customer) => (
                record.address.buildingImage !== '' ?
                    <BuildingImage image={record.address.buildingImage} />
                    : 'No Image'
            )
        },
    ]

    const columns: ColumnsType<any> = [
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
        ...(enableGrouping
            ? [
                {
                    title: 'Coordinates',
                    children: [
                        ...coordinatesOptions
                    ]
                }
            ]
            : coordinatesOptions
        ),
        {
            title: 'Additional Phone Numbers',
            key: 'additionalPhoneNumbers',
            dataIndex: 'additionalPhoneNumbers',
            ellipsis: {
                showTitle: false,
            },
            render: (phoneNumbers) => {
                const renderPhones = phoneNumbers.map((phone: any, index: number) => {
                    let color = phone.length > 5 ? 'geekblue' : 'green';
                    return (
                        <Tag color={color} key={index}
                        >
                            {phone}
                        </Tag>
                    );
                })

                const renderPhonesTooltip = phoneNumbers.map((phone: any, index: number) => {
                    return (
                        <div key={index}>{phone}{index !== phoneNumbers.length - 1 ? ',' : ''}</div>
                    );
                })
                return (
                    <Tooltip title={renderPhonesTooltip}>
                        {renderPhones}
                    </Tooltip>
                )
            }
        },
        ...(enableGrouping
            ? [
                {
                    title: 'Logs',
                    children: [
                        ...logsOptions
                    ]
                }
            ]
            : logsOptions
        ),
    ]

    return (
        <>
            <Table
                dataSource={data}
                rowKey={'_id'}
                columns={columns}
                pagination={false}
                bordered
                scroll={{ x: 1400 }}
            />

            <Divider style={{ backgroundColor: 'blue' }} />
        </>
    )
}

export default ExpandedRowRender