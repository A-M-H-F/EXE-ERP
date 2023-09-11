import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Button, Skeleton } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RolesList } from './components/rolesList'
import { Link } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'

const RolesPage = () => {
    useDocumentMetadata('EX - Roles', 'Extreme Engineering - Roles Page')

    // Check permissions
    const { role } = useSelector((state: AuthState) => state.auth)
    const checkCanAddNewRole = hasPermission(role, 'Roles', 'Create')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (role) {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [role])

    return (
        <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
            <>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    {checkCanAddNewRole &&
                        <Link to={'/roles/addNew'}>
                            <Button
                                type='primary'
                                style={{
                                    marginBottom: '2em'
                                }}
                                icon={<PlusOutlined />}
                            >
                                Add New Role
                            </Button>
                        </Link>
                    }
                </div>

                <RolesList />
            </>
        </Skeleton>
    )
}

export default RolesPage