import { UserSwitchOutlined } from '@ant-design/icons'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { dispatchGetUser } from '@features/actions/auth'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { checkLength, checkWhiteSpaces, isEqualString } from '@utils/stringCheck'
import { Button, Form, Input, Space, Spin, message as messageApi } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type UsernameInitialState = {
    userName: string
}

const ChangeUsername = () => {
    const { user } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

    const initialState: UsernameInitialState = {
        userName: user?.username
    }

    const [updating, setUpdating] = useState<boolean>(false)
    const [newUsername, setNewUsername] = useState<UsernameInitialState>(initialState)
    const { userName } = newUsername

    const handleUsernameChange = (e: any) => {
        const { name, value } = e?.target

        setNewUsername({ ...newUsername, [name]: String(value) })
    }

    const handleUpdateUsername = async () => {
        const isEqual = isEqualString(userName, user?.username)
        if (isEqual) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a different username'
            })
            return
        }

        const userNameWhiteSpaceCheck = checkWhiteSpaces(userName)
        const userNameLength = checkLength(userName, 3)
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

        const isValidUsername = /^[a-z]+$/.test(userName);

        if (!isValidUsername) {
            messageApi.open({
                type: 'error',
                content: 'Username can only contain lowercase letters (a-z).'
            })
            return
        }

        const body = {
            username: userName
        }

        setUpdating(true)
        try {
            const { data } = await apiService.PUT(`/user/username`, body, token)

            const { message, newUserInfo } = data;

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })

            socketProvider.emit('getUsersList_to_server', { userId: user?._id })

            setUpdating(false)
            dispatch(dispatchGetUser(generateResponseBody(newUserInfo)))
        } catch (error: any) {
            setUpdating(false)
            messageApi.open({
                type: 'error',
                content: '',
                duration: 2
            })
        }
    }

    return (
        <Spin spinning={updating}>
            <Form
                layout='vertical'
                onFinish={handleUpdateUsername}
            >
                <Space>
                    <Form.Item
                        label={'Username'}
                        name='userName'
                        initialValue={userName}
                        rules={[{ required: true, message: 'Please input your username!' }]}
                        style={{ marginBottom: '3.8em' }}
                        required={false}
                    >
                        <Input
                            prefix={<UserSwitchOutlined />}
                            name='userName'
                            onChange={handleUsernameChange}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 1, span: 0 }}>
                        <Button type="primary" htmlType="submit"
                            disabled={isEqualString(userName, user?.username)|| checkWhiteSpaces(userName)}
                        >
                            Update Username
                        </Button>
                    </Form.Item>
                </Space>
            </Form>
        </Spin>
    )
}

export default ChangeUsername