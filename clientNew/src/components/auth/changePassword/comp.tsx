import { LockOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { TokenState } from '@features/reducers/token'
import { Button, Form, Input, Spin, message as messageApi } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

type InitialStateVars = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

const initialState: InitialStateVars = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
    { re: /.{6,}/, label: 'At least 6 characters' }
]

const ChangePassword = () => {
    const token = useSelector((state: TokenState) => state.token)

    const [updating, setUpdating] = useState<boolean>(false)

    const [passwordInfo, setPasswordInfo] = useState<InitialStateVars>(initialState)
    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = passwordInfo
    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setPasswordInfo({ ...passwordInfo, [name]: String(value) })
    }

    const handleChangePassword = async () => {
        if (newPassword === '' || confirmPassword === '' || currentPassword === '') {
            messageApi.open({
                type: 'error',
                content: 'Fields are empty'
            })
            return
        }
        requirements?.map((check: any) => {
            if (!check?.re.test(newPassword)) {
                messageApi.open({
                    type: 'error',
                    content: `${check?.label}`
                })
                return
            }
        })
        if (newPassword.indexOf(" ") !== -1) {
            messageApi.open({
                type: 'error',
                content: 'Password should not contain a space'
            })
            return
        }
        if (newPassword !== confirmPassword) {
            messageApi.open({
                type: 'error',
                content: 'Passwords should match'
            })
            return
        }

        if (newPassword === currentPassword) {
            messageApi.open({
                type: 'error',
                content: 'Please choose different password'
            })
            return
        }

        const body = {
            currentPassword,
            newPassword
        }

        setUpdating(true)
        try {
            const { data } = await apiService.PUT('/user/pass', body, token)
            const { message } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })
            setPasswordInfo(initialState)
            setUpdating(false)
        } catch (error: any) {
            setUpdating(false)
            await messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    return (
        <Spin spinning={updating}>
            <Form
                layout='vertical'
                wrapperCol={{ xs: { span: 8 }, xxl: { span: 4 } }}
                onFinish={handleChangePassword}
            >
                <Form.Item
                    label={'Current Password'}
                    required
                >
                    <Input.Password
                        onChange={handleInputChange}
                        name='currentPassword'
                        prefix={<LockOutlined />}
                        value={currentPassword}
                        placeholder='******'
                    />
                </Form.Item>
                <Form.Item
                    label={'New Password'}
                    required
                >
                    <Input.Password
                        onChange={handleInputChange}
                        name='newPassword'
                        prefix={<LockOutlined />}
                        value={newPassword}
                        placeholder='******'
                    />
                </Form.Item>
                <Form.Item
                    label={'Current Password'}
                    required
                >
                    <Input.Password
                        onChange={handleInputChange}
                        name='confirmPassword'
                        prefix={<LockOutlined />}
                        value={confirmPassword}
                        placeholder='******'
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit"
                    >
                        Update Password
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}

export default ChangePassword