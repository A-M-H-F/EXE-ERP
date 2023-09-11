import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AddNewIsp } from './components/addNewIsp'
import { IspList } from './components/ispList'

const ISPPage = () => {
    useDocumentMetadata('EX - ISP', 'Extreme Engineering - ISP Page')

    // Check permissions
    const { role } = useSelector((state: AuthState) => state.auth)
    const checkCanAddIsp = hasPermission(role, 'Internet Service Providers', 'Create')

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
                    {checkCanAddIsp &&
                        <AddNewIsp />
                    }
                </div>

                <IspList />
            </Skeleton>
        </>
    )
}

export default ISPPage