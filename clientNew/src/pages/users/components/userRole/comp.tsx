import apiService from '@api/index'
import { dispatchGetAllUsers } from '@features/actions/users'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { Role } from '@utils/roles/permissionUtils'
import { User } from '@utils/types'
import { App, Select } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type UserRoleProps = {
    userId: string,
    role: Role | any,
    roles: Role[] | any,
    usersList: User[]
}

const UserRole = ({ userId, role, roles, usersList }: UserRoleProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdateUserRole = async (newRole: any) => {
        const isCurrentUser = currentUser?._id === userId
        if (isCurrentUser) {
            messageApi.open({
                type: 'error',
                content: `You can't change your role`
            })
            return;
        }

        const body = {
            role: newRole
        }

        try {
            const { data } = await apiService.PUT(`/user/role/${userId}`, body, token)

            const { message, roleName } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = usersList?.map((user: User) => {
                if (user?._id === userId) {
                    return { ...user, role: { name: roleName, _id: newRole } }
                }
                return user
            })

            dispatch(dispatchGetAllUsers(updatedList))

            // socket events
            socketProvider.emit('updateUserRole_to_server', { userId })
            socketProvider.emit('getUsersList_to_server', { userId: currentUser?._id })
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            })
        }
    }

    return (
        <>
            <Select
                value={role?._id}
                optionLabelProp="label"
                onChange={handleUpdateUserRole}
                style={{ minWidth: 120 }}
                disabled={currentUser?._id === userId}
            >
                {roles?.map((r: any) => (
                    <Select.Option
                        key={r?._id}
                        value={r?._id}
                        label={<div style={{ color: 'blue' }}>{r?.name}</div>}
                        style={{
                            color: role?._id === r._id ? 'green' : ''
                        }}
                    >
                        {r?.name}
                    </Select.Option>
                ))}
            </Select>
        </>
    )
}

export default UserRole