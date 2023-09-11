import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AddNewCustomer } from './components/addNew'
import { ActiveLocationsListState } from '@features/reducers/locations/active'
import { TokenState } from '@features/reducers/token'
import { useDispatch } from 'react-redux'
import { dispatchGetActiveLocations, fetchActiveLocations } from '@features/actions/locations'
import { Location } from '@features/reducers/locations'
import { CustomersList } from './components/list'

const CustomersPage = () => {
    useDocumentMetadata('EX - Customers', 'Extreme Engineering - Customers Page')

    const activeLocationsList = useSelector((state: ActiveLocationsListState) => state.activeLocationsList)
    const token = useSelector((state: TokenState) => state.token)
    const dispatch = useDispatch()

    // Check permissions
    const { role } = useSelector((state: AuthState) => state.auth)
    const checkCanAdd = hasPermission(role, 'Customers', 'Create')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (role) {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [role])

    useEffect(() => {
        fetchActiveLocations(token).then((res: Location[]) => {
            dispatch(dispatchGetActiveLocations(res))
        })
    }, [])

    return (
        <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {checkCanAdd &&
                    <AddNewCustomer activeLocationsList={activeLocationsList} />
                }
            </div>

            <CustomersList />
        </Skeleton>
    )
}

export default CustomersPage