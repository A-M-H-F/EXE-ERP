import apiService from '@api/index'
import { dispatchGetAllUsers } from '@features/actions/users'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { User } from '@utils/types'
import { App, Switch, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type UserStatusProps = {
    userId: string,
    userStatus: string,
    usersList: User[]
}

const UserStatus = ({ userId, userStatus, usersList }: UserStatusProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdateUserStatus = async (option: boolean) => {
        const isCurrentUser = currentUser?._id === userId
        if (isCurrentUser) {
            messageApi.open({
                type: 'error',
                content: `You can't change your status`
            })
            return;
        }

        const newStatus = option === true ? 'active' : 'inactive'
        const body = {
            status: newStatus
        }

        try {
            const { data } = await apiService.PUT(`/user/status/${userId}`, body, token)

            const { message } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = usersList?.map((user: User) => {
                if (user?._id === userId) {
                    return { ...user, status: newStatus}
                }

                return user
            })

            dispatch(dispatchGetAllUsers(updatedList))

            if (newStatus === 'inactive') {
                socketProvider.emit('updateUserStatus_to_server', { userId })
            }

            socketProvider.emit('getUsersList_to_server', { userId: currentUser?._id })
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            })
        }
    }

    return (
        <Tooltip title={`Status: ${userStatus}`}>
            <Switch
                defaultChecked={userStatus === 'active'}
                checked={userStatus === 'active'}
                onChange={handleUpdateUserStatus}
                title={userStatus}
                checkedChildren={userStatus}
                unCheckedChildren={userStatus}
                disabled={currentUser?._id === userId}
            />
        </Tooltip>
    )
}

export default UserStatus