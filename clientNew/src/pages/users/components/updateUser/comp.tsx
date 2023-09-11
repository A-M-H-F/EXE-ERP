import { EditOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetAllUsers } from '@features/actions/users'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { checkLength, checkWhiteSpaces } from '@utils/stringCheck'
import { User } from '@utils/types'
import { App, Form, Input, Modal, Spin, Tooltip} from 'antd'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type UpdateUserProps = {
    user: User,
    usersList: User[]
}

const UpdateUser = ({ user, usersList }: UpdateUserProps) => {
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

    // check
    const isCurrentUser = user?._id === currentUser?._id
    const tooltipTitle = isCurrentUser ? 'Disabled' : 'Update Info'

    // loading
    const [updating, setUpdating] = useState<boolean>(false)

    // state
    const initialState = {
        name: user?.name,
        username: user?.username
    }
    const [newUserInfo, setNewUserInfo] = useState(initialState)
    const { name, username } = newUserInfo
    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setNewUserInfo({ ...newUserInfo, [name]: String(value) })
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        if (isCurrentUser) {
            return
        }
        setIsModalOpen(true)
    }
    const handleOk = () => {
        handleUpdateUserInfo()
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        setNewUserInfo(initialState)
        setUpdating(false)
    }

    const handleUpdateUserInfo = async () => {
        const userNameWhiteSpaceCheck = checkWhiteSpaces(username)
        const userNameLength = checkLength(username, 3)

        if (userNameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Username should not contain only whitespace'
            })
            return
        }
        if (userNameLength) {
            messageApi.open({
                type: 'error',
                content: 'Username must be at least 4 characters long'
            })
            return
        }
        const isValidUsername = /^[a-z]+$/.test(username);
        if (!isValidUsername) {
            messageApi.open({
                type: 'error',
                content: 'Username can only contain lowercase letters (a-z).'
            })
            return
        }

        const nameWhiteSpaceCheck = checkWhiteSpaces(name)
        const nameLength = checkLength(name, 3)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Name should not contain only whitespace'
            })
            return
        }
        if (nameLength) {
            messageApi.open({
                type: 'error',
                content: 'Name must be at least 4 characters long'
            })
            return
        }

        const body = {
            name,
            username
        }

        try {
            setUpdating(true)

            const { data } = await apiService.PUT(`/user/${user?._id}`, body, token)

            const { message, updated } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = usersList?.map((u: User) => {
                if (u._id == user?._id) {
                    return { ...updated }
                }

                return u
            })

            dispatch(dispatchGetAllUsers(updatedList))

            // socket event
            socketProvider.emit('updateUserInfo_to_server', { userId: user?._id })
            socketProvider.emit('getUsersList_to_server', { userId: currentUser?._id })

            setUpdating(false)
            setIsModalOpen(false)
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        setNewUserInfo(initialState)
    }, [user])

    return (
        <>
            <Tooltip title={tooltipTitle}>
                <EditOutlined
                    disabled={isCurrentUser}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Update User Info"
                open={isModalOpen}
                onOk={handleOk}
                okText='Update'
                onCancel={handleCancel}
                confirmLoading={updating}
                centered
            >
                <Spin spinning={updating}>
                    <Form
                        layout='vertical'
                        style={{
                            marginBottom: '2em'
                        }}
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label='Full Name'
                            required
                        >
                            <Input
                                type='text'
                                value={name}
                                onChange={handleInputChange}
                                name='name'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Username'
                            required
                        >
                            <Input
                                type='text'
                                value={username}
                                onChange={handleInputChange}
                                name='username'
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}

export default UpdateUser