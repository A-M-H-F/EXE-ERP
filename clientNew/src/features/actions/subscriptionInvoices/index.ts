// subscriptionInvoices

import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import ACTIONS from '..'
import apiService from '@api/index'

type Params = {
    start: Date,
    end: Date
}

export const fetchSubscriptionsInvoices = async (token: string, params: Params) => {
    const { data } = await apiService.GETWithParams('/subscription-invoice', params, token)
    return data
}

export const dispatchGetSubscriptionsInvoices = (res: SubscriptionInvoice[]) => {
    return {
        type: ACTIONS.GET_SUBSCRIPTION_INVOICES,
        payload: res
    }
}