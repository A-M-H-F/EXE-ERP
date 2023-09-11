import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Button, Skeleton } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LocationsList } from './components/list'
import { Link } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'

const LocationsPage = () => {
    useDocumentMetadata('EX - Locations', 'Extreme Engineering - Locations Page')

    // Check permissions
    const { role } = useSelector((state: AuthState) => state.auth)
    const checkCanAdd = hasPermission(role, 'Locations', 'Create')

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
                {checkCanAdd &&
                    <Link to={'/locations/addNew'}>
                        <Button
                            type='primary'
                            style={{
                                marginBottom: '2em'
                            }}
                            icon={<PlusOutlined />}
                        >
                            Add New Location
                        </Button>
                    </Link>
                }
            </div>

            <LocationsList />
        </Skeleton>
    )
}

export default LocationsPage