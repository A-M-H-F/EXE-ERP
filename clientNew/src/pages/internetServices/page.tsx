import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { InternetServicesList } from './components/list'
import { AddNewInternetService } from './components/addNew'

const InternetServicesPage = () => {
    useDocumentMetadata('EX - Internet Services', 'Extreme Engineering - Internet Services Page')

    // Check permissions
    const { role } = useSelector((state: AuthState) => state.auth)
    const checkCanAdd = hasPermission(role, 'Internet Services', 'Create')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (role) {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [role])

    return (
        <>
            <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    {checkCanAdd &&
                        <AddNewInternetService /> 
                    }
                </div>

                <InternetServicesList />
            </Skeleton>
        </>
    )
}

export default InternetServicesPage