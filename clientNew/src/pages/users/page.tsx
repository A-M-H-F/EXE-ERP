import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Skeleton } from 'antd'
import { UsersList } from './components/usersList'
import { AddNewUser } from './components/addNewUser'

const UsersPage = () => {
    useDocumentMetadata('EX - Users', 'Extreme Engineering - Users Page')

    // Check permissions
    const { role } = useSelector((state: AuthState) => state.auth)
    const checkCanAddNewUser = hasPermission(role, 'Users', 'Create')

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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {checkCanAddNewUser &&
                    <AddNewUser />
                }
            </div>

            <UsersList />
        </Skeleton>
    )
}

export default UsersPage