import { dispatchGetISP, fetchISP } from '@features/actions/isp'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { AuthState } from '@features/reducers/auth'
import { ISP, ISPListState } from '@features/reducers/isp'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Space, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { IspStatus } from '../ispStatus'
import { UpdateIsp } from '../updateIsp'
import { DeleteIsp } from '../deleteIsp'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

const IspList = () => {
    const token = useSelector((state: TokenState) => state.token)
    const ispList = useSelector((state: ISPListState) => state.ispList)
    const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { role, user: currentUser } = useSelector((state: AuthState) => state.auth)
    const canUpdate = hasPermission(role, 'Internet Service Providers', 'Update')
    const canDelete = hasPermission(role, 'Internet Service Providers', 'Delete')

    const fetchIspList = async () => {
        fetchISP(token).then((res: ISP[]) => {
            dispatch(dispatchGetISP(res))
        })
    }

    useEffect(() => {
        fetchIspList()

        fetchUsersSelection(token).then((res: any) => {
            dispatch(dispatchGetUsersSelection(res))
        })
    }, [])

    useEffect(() => {
        socketProvider.on('getAllIsp_to_client', async function ({
            userId
        }) {
            if (currentUser !== userId) {
                await fetchIspList()
            }
        });

        return () => {
            socketProvider.off("getAllIsp_to_client", fetchIspList);
        }
    }, [])

    // filters
    const filtersNames = ispList?.map((isp: ISP) => (
        { text: isp.name, value: isp.name }
    ))
    const filtersCode = ispList?.map((isp: ISP) => (
        { text: isp.code, value: isp.code }
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
            title: 'ISP Code',
            key: 'ispCode',
            dataIndex: 'code',
            filterSearch: true,
            onFilter: (value, record) => record?.code === value,
            sorter: (a, b) => a?.code - b?.code,
            filters: filtersCode,
        },
        {
            title: 'Address',
            key: 'address',
            dataIndex: 'address',
        },
        {
            title: 'Contact Info',
            key: 'contactInfo',
            dataIndex: 'contactInfo',
            render: (text) => text === '' ? '------' : text
        },
        {
            title: 'Phone Numbers',
            key: 'phoneNumbers',
            dataIndex: 'phoneNumbers',
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
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, isp) => (
                canUpdate ? <IspStatus ispId={isp?._id} ispStatus={isp?.status} ispList={ispList} />
                    : isp?.status
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
                render: (_: any, isp: ISP) => (
                    <Space>
                        <UpdateIsp isp={isp} />

                        {canDelete &&
                            <DeleteIsp ispId={isp?._id} ispList={ispList} />
                        }
                    </Space>
                ),
            }
        )
    }

    return (
        <>
            <Table
                columns={updatedColumns}
                dataSource={ispList}
                rowKey={'_id'}
                bordered
                scroll={{ x: 1200 }}
            />
        </>
    )
}

export default IspList