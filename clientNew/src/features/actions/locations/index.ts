import ACTIONS from '..'
import apiService from '@api/index'
import { Location } from '@features/reducers/locations'

export const fetchLocations = async (token: string) => {
    const { data } = await apiService.GET('/address', token)
    return data
}

export const dispatchGetLocations = (res: Location[]) => {
    return {
        type: ACTIONS.GET_ALL_LOCATIONS,
        payload: res
    }
}

export const fetchActiveLocations = async (token: string) => {
    const { data } = await apiService.GET('/address/status/active', token)
    return data
}

export const dispatchGetActiveLocations = (res: Location[]) => {
    return {
        type: ACTIONS.GET_ACTIVE_LOCATIONS,
        payload: res
    }
}