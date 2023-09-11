import Icon, { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Form, Input, Modal, Space, Spin, Tooltip } from 'antd'
import { useState } from 'react'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'

type ChangeUserPassProps = {
    userId: string
}

const initialState = {
    newPassword: '',
    confirmPassword: '',
}

function PasswordRequirement({ label, meets }: { meets: boolean; label: string }) {
    return (
        <div>
            {meets ?
                <Space>
                    <CheckOutlined style={{ color: 'green' }} />
                    {label}
                </Space >
                :
                <Space>
                    <CloseOutlined style={{ color: 'red' }} />
                    {label}
                </Space >}
        </div>
    )
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
    { re: /.{6,}/, label: 'At least 6 characters' }
]

const ChangeUserPass = ({ userId }: ChangeUserPassProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()

    // check
    const isCurrentUser = userId === currentUser?._id
    const tooltipTitle = isCurrentUser ? 'Disabled' : 'Update Password'

    // loading
    const [updating, setUpdating] = useState<boolean>(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        if (isCurrentUser) {
            return
        }
        setIsModalOpen(true)
    }
    const handleOk = () => {
        handleUpdatePass()
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        setNewPassInfo(initialState)
        setUpdating(false)
    }

    // pass state
    const [newPassInfo, setNewPassInfo] = useState(initialState)
    const { newPassword, confirmPassword } = newPassInfo
    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setNewPassInfo({ ...newPassInfo, [name]: String(value) })
    }

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(newPassword)} />
    ))

    const handleUpdatePass = async () => {
        let types = true;
        checks.map((check: any) => {
            if (!check?.props?.meets) {
                types = false
                messageApi.open({
                    type: 'error',
                    content: check?.props?.label
                })
                return
            }
        })

        if (!types) {
            messageApi.open({
                type: 'error',
                content: 'Please check password conditions'
            })
            return
        }

        if (confirmPassword !== newPassword) {
            messageApi.open({
                type: 'error',
                content: 'Please confirm the new password'
            })
            return
        }

        const body = {
            password: newPassword
        }

        try {
            setUpdating(true)
            const { data } = await apiService.PUT(`/user/pass/${userId}`, body, token)

            const { message } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            // socket event
            socketProvider.emit('updateUserPass_to_server', { userId })

            setNewPassInfo(initialState)
            setUpdating(false)
            setIsModalOpen(false)
        } catch (error: any) {
            setUpdating(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Tooltip title={tooltipTitle}>
                <Icon component={RiLockPasswordLine}
                    disabled={isCurrentUser}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Update User Password"
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
                            label='New Password'
                            required
                        >
                            <Input.Password
                                value={newPassword}
                                onChange={handleInputChange}
                                name='newPassword'
                                placeholder='******'
                                prefix={<RiLockPasswordLine />}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Confirm Password'
                            required
                        >
                            <Input.Password
                                value={confirmPassword}
                                onChange={handleInputChange}
                                name='confirmPassword'
                                placeholder='******'
                                prefix={<RiLockPasswordLine />}
                            />
                        </Form.Item>

                        {checks}
                        {confirmPassword !== newPassword && confirmPassword !== '' ?
                            <PasswordRequirement label="Match Passwords" meets={confirmPassword == newPassword} />
                            : null}
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}

export default ChangeUserPass