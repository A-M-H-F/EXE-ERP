import apiService from '@api/index'
import { dispatchGetCustomers } from '@features/actions/customers'
import { AuthState } from '@features/reducers/auth'
import { Customer } from '@features/reducers/customers'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Switch, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type CustomerStatusProps = {
    status: string,
    id: string,
    customersList: Customer[]
}

const CustomerStatus = ({ status, id, customersList }: CustomerStatusProps) => {
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
                `/customer/status/${id}`,
                body,
                token
            )

            const { message } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = customersList.map((customer: Customer) => {
                if (customer._id === id) {
                    return { ...customer, status: newStatus }
                }
                return customer
            })
            dispatch(dispatchGetCustomers(updatedList))

            socketProvider.emit('getCustomers_to_server',
                {
                    userId: currentUser?._id,
                }
            )
            socketProvider.emit('getCustomer_to_server', { customer: id })
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

export default CustomerStatus