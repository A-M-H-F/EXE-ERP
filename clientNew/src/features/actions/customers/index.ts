import { Customer } from '@features/reducers/customers'
import ACTIONS from '..'
import apiService from '@api/index'

export const fetchCustomers = async (token: string) => {
    const { data } = await apiService.GET('/customer', token)
    return data
}

export const dispatchGetCustomers = (res: Customer[]) => {
    return {
        type: ACTIONS.GET_ALL_CUSTOMERS,
        payload: res
    }
}

export const fetchActiveCustomers = async (token: string) => {
    const { data } = await apiService.GET('/customer/active', token)
    return data
}

export const dispatchGetActiveCustomers = (res: Customer[]) => {
    return {
        type: ACTIONS.GET_ACTIVE_CUSTOMERS,
        payload: res
    }
}