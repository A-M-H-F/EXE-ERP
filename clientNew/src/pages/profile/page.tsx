import { SecurityScanOutlined, UserOutlined } from '@ant-design/icons'
import { ChangePassword } from '@components/auth/changePassword'
import { ChangeProfilePicture } from '@components/auth/changeProfilePicture'
import { ChangeUsername } from '@components/auth/changeUsername'
import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { Col, Divider, Form, Input, Row, Skeleton } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
    useDocumentMetadata('EX - Profile', 'Extreme Engineering - Profile Page')
    const { user, role } = useSelector((state: AuthState) => state.auth)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [user])

    return (
        <Skeleton loading={loading} active avatar paragraph={{ rows: 18 }}>
            <Row gutter={[10, 5]}
                style={{
                    padding: 20
                }}
            >
                <Col span={24}>
                    <ChangeProfilePicture />
                </Col>
                <Col
                    xs={{ span: 24 }}
                    xl={{ span: 4 }}
                    xxl={{ span: 4 }}
                >
                    <Form
                        layout='vertical'
                    >
                        <Form.Item
                            label={'Full Name'}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                value={user?.name}
                                readOnly
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col
                    xs={{ span: 24 }}
                    xl={{ span: 4 }}
                    xxl={{ span: 4 }}
                >
                    <Form
                        layout='vertical'
                    >
                        <Form.Item
                            label={'Role'}
                        >
                            <Input
                                prefix={<SecurityScanOutlined />}
                                value={role?.name}
                                readOnly
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={24}>
                    <ChangeUsername />
                </Col>
                <Col span={24}>
                    <Divider style={{ margin: 0 }} />
                </Col>
                <Col span={24}>
                    <ChangePassword />
                </Col>
            </Row>
        </Skeleton>
    )
}

export default ProfilePage