import { InternetService } from '@features/reducers/internetServices'
import ACTIONS from '..'
import apiService from '@api/index'

export const fetchInternetServices = async (token: string) => {
    const { data } = await apiService.GET('/internet-service', token)
    return data
}

export const dispatchGetInternetServices = (res: InternetService[]) => {
    return {
        type: ACTIONS.GET_INTERNET_SERVICES,
        payload: res
    }
}

export const fetchActiveInternetServices = async (token: string) => {
    const { data } = await apiService.GET('/internet-service/active', token)
    return data
}

export const dispatchGetActiveInternetServices = (res: InternetService[]) => {
    return {
        type: ACTIONS.GET_ACTIVE_INTERNET_SERVICES,
        payload: res
    }
}