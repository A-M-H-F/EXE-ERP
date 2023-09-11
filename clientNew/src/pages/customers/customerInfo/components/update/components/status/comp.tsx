import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { Customer } from '@features/reducers/customers'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Switch, Tooltip } from 'antd'
import { useSelector } from 'react-redux'

type CustomerStatusProps = {
    setCustomerInfo: (customer: Customer) => void,
    customerInfo: Customer,
}

const CustomerPageStatus = ({ customerInfo, setCustomerInfo }: CustomerStatusProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdate = async (option: boolean) => {
        const newStatus = option === true ? 'active' : 'inactive'
        const body = {
            status: newStatus
        }

        try {
            const { data } = await apiService.PUT(
                `/customer/status/${customerInfo._id}`,
                body,
                token
            )

            const { message } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedCustomer = {
                ...customerInfo,
                status: newStatus
            }
            setCustomerInfo(updatedCustomer)

            socketProvider.emit('getCustomers_to_server',
                {
                    userId: currentUser?._id,
                }
            )

            socketProvider.emit('updateCustomer_to_server', {})
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            })
        }
    }

    return (
        <Tooltip title={`Status: ${customerInfo.status}`}>
            <Switch
                defaultChecked={customerInfo.status === 'active'}
                checked={customerInfo.status === 'active'}
                onChange={handleUpdate}
                title={customerInfo.status}
                checkedChildren={customerInfo.status}
                unCheckedChildren={customerInfo.status}
            />
        </Tooltip>
    )
}

export default CustomerPageStatus