import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Spin,
    message as messageApi
} from 'antd'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { dispatchLogin } from '@features/actions/auth';
import axios from 'axios';
import endUrl from '@utils/endUrl';

type InitialStateProps = {
    username: string,
    password: string
}

type FieldType = {
    username?: string;
    password?: string;
};

const initialState: InitialStateProps = {
    username: '',
    password: '',
}


const LoginForm = () => {
    const history = useNavigate()
    const dispatch = useDispatch()

    const [authLoginStatus, setAuthLoginStatus] = useState(false)
    const [authLogin, setAuthLogin] = useState(initialState)
    const {
        username,
        password,
    } = authLogin

    const handleChangeInput = (e: any) => {
        const { name, value } = e.target
        if (name === 'username') {
            setAuthLogin({ ...authLogin, [name]: value?.toLowerCase() })
        } else {
            setAuthLogin({ ...authLogin, [name]: value })
        }
    }

    const handleAuthLogin = async () => {
        if (username === '' || password === '') {
            messageApi.open({
                type: 'error',
                content: 'Please include all fields',
                duration: 2
            })
            return;
        }

        setAuthLoginStatus(true)

        await messageApi.open({
            type: 'loading',
            content: 'Login in progress..',
            duration: 0.4
        })

        try {
            const { data } = await axios.post(`${endUrl}/auth/login`, {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            localStorage.setItem('extreme', String(true))
            dispatch(dispatchLogin())

            const { message } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })

            setAuthLoginStatus(false)
            history('/')
        } catch (error: any) {
            setAuthLoginStatus(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '48px 32px'
            }}
        >
            <Spin spinning={authLoginStatus}>
                <Form
                    layout='vertical'
                    onFinish={handleAuthLogin}
                    autoComplete='on'
                    style={{
                        minWidth: '300px',
                        maxWidth: 600,
                        borderRadius: 5,
                        padding: 25,
                        boxShadow: '5px 4px 4px 4px #888888'
                    }}
                    initialValues={{ remember: true }}
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            name="username"
                            onChange={handleChangeInput}
                            value={username}
                            placeholder='extreme'
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        style={{
                            marginBottom: '35px'
                        }}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            name="password"
                            onChange={handleChangeInput}
                            value={password}
                            placeholder='******'
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}

export default LoginForm