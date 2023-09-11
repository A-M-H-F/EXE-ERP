import { dispatchGetRoles, fetchRoles } from '@features/actions/roles'
import { RoleListState } from '@features/reducers/roles'
import { TokenState } from '@features/reducers/token'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { EyeOutlined } from '@ant-design/icons'
import { DeleteRole } from '../deleteRole'
import { Role } from '@utils/types'

const RolesList = () => {
    const token = useSelector((state: TokenState) => state.token)
    const roles = useSelector((state: RoleListState) => state.roles)
    const dispatch = useDispatch()

    const filtersNames = roles?.map((role: any) => (
        { text: role?.name, value: role?.name }
    ))

    useEffect(() => {
        fetchRoles(token).then((res: any) => {
            dispatch(dispatchGetRoles(res))
        })
    }, [])

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            render: (_, role: Role) => (
                <Link to={`/roles/${role?._id}`}>
                    {role?.name}
                </Link>
            ),
            fixed: 'left',
            filterSearch: true,
            onFilter: (value: any, record: any) => record?.name?.includes(value),
            filters: filtersNames,
            sorter: (a, b) => a.name.length - b.name.length,
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
            title: 'Update Date',
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            render: (date: Date) => new Date(date)?.toLocaleDateString('en-GB'),
            sorter: (a: any, b: any) => {
                const dateA = new Date(a.updatedAt as string).getTime();
                const dateB = new Date(b.updatedAt as string).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: '_id',
            fixed: 'right',
            render: (roleId) => (
                <Space>
                    <Link to={`/roles/${roleId}`}>
                        <Tooltip title="View/Edit Role">
                            <EyeOutlined />
                        </Tooltip>
                    </Link>
                    <DeleteRole roleId={roleId} />
                </Space>
            )
        }
    ]

    return (
        <>
            <Table
                columns={columns}
                dataSource={roles}
                rowKey={'_id'}
                bordered
            />
        </>
    )
}

export default RolesList