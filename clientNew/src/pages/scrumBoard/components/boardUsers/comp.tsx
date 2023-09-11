import { useEffect } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { useSocket } from '@socket/provider/socketProvider'
import { useDispatch } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { useSelector } from 'react-redux'
import { TokenState } from '@features/reducers/token'
import { App, Select, Tooltip } from 'antd'
import { SelectUser } from '../selectUser'
import apiService from '@api/index'
import { UserAddOutlined } from '@ant-design/icons'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

type AddUserToBoardProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const BoardUsers = ({ boardInfo, setBoardInfo }: AddUserToBoardProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()

    const defaultSelected = boardInfo?.users?.map((user: any) => user?.user?._id)

    useEffect(() => {
        if (token) {
            fetchUsersSelection(token).then((res: any) => {
                dispatch(dispatchGetUsersSelection(res))
            })
        }
    }, [token])

    const handleUpdateUsers = async (selectedUsers: any) => {
        const filteredA = selectedUsers?.filter((u: any) => u !== currentUser?._id)
        const filteredB = boardInfo?.users?.filter((u: any) => u?.user?._id !== currentUser?._id)

        const newList = [...selectedUsers]?.map((user: any) => (
            {
                user: user
            }
        ))

        const body = {
            users: newList
        }

        try {
            const { data } = await apiService.PUT(`/boards/user/update/${boardInfo?._id}`, body, token)

            const { message, newBoardInfo } = data

            setBoardInfo(newBoardInfo)

            // send socket event
            if (filteredA?.length > 0 && filteredA?.length > filteredB?.length) {
                filteredA?.map((user: any) => {
                    socketProvider.emit('updateBoardUsers_to_server',
                        { user: user, fromBoard: boardInfo?._id })
                })
            } else {
                filteredB?.map((u: any) => {
                    socketProvider.emit('updateBoardUsers_to_server',
                        { user: u?.user?._id, fromBoard: boardInfo?._id })
                })
            }

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })
        } catch (error: any) {
            messageApi.open({
                type: 'success',
                content: await error?.response?.data?.message,
            })
        }
    }

    const { screenSizes } = useWindowDimensions()
    const { xs, sm } = screenSizes

    return (
        <>
            <Tooltip title={'Select Board Users'}>
                <Select
                    mode="multiple"
                    placeholder="Inserted are removed"
                    onChange={handleUpdateUsers}
                    style={{
                        width: 'auto',
                        marginRight: xs || sm ? '0.5em' : '',
                        marginBottom: xs || sm ? '0.5em' : ''
                    }}
                    optionLabelProp="label"
                    defaultValue={defaultSelected}
                    suffixIcon={<UserAddOutlined />}
                >
                    {usersSelection.map((user: any) => (
                        <Select.Option
                            value={user?._id}
                            label={user?.name}
                            key={user?._id}
                            disabled={currentUser?._id === user?._id}
                        >
                            <SelectUser user={user} />
                        </Select.Option>
                    ))}
                </Select>
            </Tooltip>
        </>
    )
}

export default BoardUsers