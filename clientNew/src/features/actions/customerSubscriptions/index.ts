
import { CustomerSubscription } from '@features/reducers/customerSubscriptions'
import ACTIONS from '..'
import apiService from '@api/index'

export const fetchCustomersSubscriptions = async (token: string) => {
    const { data } = await apiService.GET('/subscription', token)
    return data
}

export const dispatchGetCustomersSubscriptions = (res: CustomerSubscription[]) => {
    return {
        type: ACTIONS.GET_CUSTOMERS_SUBSCRIPTIONS,
        payload: res
    }
}