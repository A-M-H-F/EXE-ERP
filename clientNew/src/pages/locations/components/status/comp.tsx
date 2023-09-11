import apiService from '@api/index'
import { dispatchGetActiveLocations, dispatchGetLocations } from '@features/actions/locations'
import { AuthState } from '@features/reducers/auth'
import { Location } from '@features/reducers/locations'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Switch, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type LocationStatusProps = {
    status: string,
    id: string,
    locationsList: Location[],
    activeLocationsList: Location[],
}

const LocationStatus = ({ status, id, locationsList, activeLocationsList }: LocationStatusProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdate = async (option: boolean) => {
        const newStatus = option === true ? 'active' : 'inactive'
        const body = {
            status: newStatus
        }

        try {
            const { data } = await apiService.PUT(
                `/address/status/${id}`,
                body,
                token
            )

            const { message } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = locationsList.map((city: Location) => {
                if (city._id === id) {
                    return { ...city, status: newStatus }
                }
                return city
            })
            dispatch(dispatchGetLocations(updatedList))

            if (newStatus === 'inactive') {
                const activeList = activeLocationsList.filter((location: Location) => location._id !== id)
                dispatch(dispatchGetActiveLocations(activeList))
            } else {
                dispatch(dispatchGetActiveLocations(updatedList))
            }

            socketProvider.emit('getLocations_to_server',
                {
                    userId: currentUser?._id,
                }
            )
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            })
        }
    }

    return (
        <Tooltip title={`Status: ${status}`}>
            <Switch
                defaultChecked={status === 'active'}
                checked={status === 'active'}
                onChange={handleUpdate}
                title={status}
                checkedChildren={status}
                unCheckedChildren={status}
            />
        </Tooltip>
    )
}

export default LocationStatus