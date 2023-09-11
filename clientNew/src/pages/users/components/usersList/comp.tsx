import { dispatchGetRoles, fetchRoles } from '@features/actions/roles'
import { dispatchGetAllUsers, fetchAllUsers } from '@features/actions/users'
import { RoleListState } from '@features/reducers/roles'
import { TokenState } from '@features/reducers/token'
import { UsersListState } from '@features/reducers/users'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { UserRole } from '../userRole'
import { AuthState } from '@features/reducers/auth'
import { hasPermission } from '@utils/roles/permissionUtils'
import { UserStatus } from '../userStatus'
import { Space } from 'antd'
import UserNamePicRow from '../userNamePicRow/comp'
import { UpdateUser } from '../updateUser'
import { ChangeUserPass } from '../changeUserPass'
import { UpdateUserPic } from '../updateUserPic'
import { useSocket } from '@socket/provider/socketProvider'

const UsersList = () => {
    const token = useSelector((state: TokenState) => state.token)
    const dispatch = useDispatch()
    const usersList = useSelector((state: UsersListState) => state.usersList)
    const roles = useSelector((state: RoleListState) => state.roles)
    const { role, user: currentUser } = useSelector((state: AuthState) => state.auth)
    const canUpdate = hasPermission(role, 'Users', 'Update')
    const { socketProvider } = useSocket()

    // filters
    const filtersNames = usersList?.map((user: any) => (
        { text: user?.name, value: user?.name }
    ))
    const filterUsernames = usersList?.map((user: any) => (
        { text: user?.username, value: user?.username }
    ))
    const filtersRoles = roles?.map((role: any) => (
        { text: role?.name, value: role?.name }
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

    const fetchUsersList = async () => {
        fetchAllUsers(token).then((res: any) => {
            dispatch(dispatchGetAllUsers(res))
        })
    }

    useEffect(() => {
        fetchUsersList()

        fetchRoles(token).then((res: any) => {
            dispatch(dispatchGetRoles(res))
        })
    }, [])

    useEffect(() => {
        socketProvider.on('getUsersList_to_client', async function ({
            userId
        }) {
            if (currentUser !== userId) {
                await fetchUsersList()
            }
        });

        return () => {
            socketProvider.off("getUsersList_to_client", fetchUsersList);
        }
    }, [])

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            render: (_, user: any) => <UserNamePicRow name={user?.name} pic={user?.picture} />,
            fixed: 'left',
            filterSearch: true,
            onFilter: (value: any, record: any) => record?.name === value,
            filters: filtersNames,
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Username',
            key: 'username',
            dataIndex: 'username',
            filterSearch: true,
            onFilter: (value: any, record: any) => record?.username === value,
            filters: filterUsernames,
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            filterSearch: true,
            render: (_, user) => (
                canUpdate ? <UserRole userId={user?._id} role={user?.role} roles={roles} usersList={usersList} />
                    : user?.role?.name
            ),
            onFilter: (value: any, record: any) => record?.role?.name === value,
            filters: filtersRoles,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, user) => (
                canUpdate ? <UserStatus userId={user?._id} userStatus={user?.status} usersList={usersList} />
                    : user?.status
            ),
            onFilter: (value: any, record: any) => record?.status === value,
            filters: filtersStatus,
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
                render: (_: any, user: any) => (
                    <Space>
                        <UpdateUser user={user} usersList={usersList} />
                        <UpdateUserPic userId={user?._id} usersList={usersList} />
                        <ChangeUserPass userId={user?._id} />
                    </Space>
                ),
            }
        )
    }

    return (
        <>
            <Table
                columns={updatedColumns}
                dataSource={usersList}
                rowKey={'_id'}
                bordered
                scroll={{ x: 1200 }}
            />
        </>
    )
}

export default UsersList