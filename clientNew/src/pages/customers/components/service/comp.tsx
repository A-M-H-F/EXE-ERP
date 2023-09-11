import apiService from '@api/index'
import { dispatchGetCustomers } from '@features/actions/customers'
import { AuthState } from '@features/reducers/auth'
import { Customer } from '@features/reducers/customers'
import { InternetService } from '@features/reducers/internetServices'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Select } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type CustomerServiceProps = {
    id: string,
    service?: string,
    activeInternetServicesList: InternetService[],
    customersList: Customer[]
}

const CustomerService = ({
    id,
    service,
    activeInternetServicesList,
    customersList,
}: CustomerServiceProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdate = async (newService: string) => {
        if (!newService || newService === '') {
            messageApi.open({
                type: 'error',
                content: 'Please select service',
                duration: 2
            })
            return
        }

        if (newService === service) {
            messageApi.open({
                type: 'error',
                content: 'This service already set, please choose different one',
                duration: 2
            })
            return
        }

        const body = {
            service: newService
        }

        try {
            const { data } = await apiService.PUT(`/customer/subscription/${id}`, body, token)

            const { message, serviceName } = data

            messageApi.open({
                type: 'success',
                content: message
            })

            if (serviceName) {
                const updatedList = customersList.map((customer) => {
                    if (customer._id === id) {
                        return { ...customer, service: { service: serviceName, _id: newService } }
                    }
                    return customer
                })
                dispatch(dispatchGetCustomers(updatedList))
            }

            // socket event
            socketProvider.emit('getCustomers_to_server', { userId: currentUser?._id })
            socketProvider.emit('getCustomersSubscriptions_to_server', { userId: currentUser?._id })
            socketProvider.emit('getCustomerSubscription_to_server', { customer: id })
            socketProvider.emit('getCustomer_to_server', { customer: id })
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Select
                showSearch
                filterOption={(input: string, option: any) =>
                    (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())
                }
                optionLabelProp='label'
                onChange={handleUpdate}
                value={service ? service : 'Select Service'}
                style={{
                    minWidth: '100%'
                }}
            >
                {activeInternetServicesList && activeInternetServicesList?.map((option) => (
                    <Select.Option
                        key={option._id}
                        value={option._id}
                        label={option.service}
                    >
                        {option.service}
                    </Select.Option>
                ))}
            </Select>
        </>
    )
}

export default CustomerService