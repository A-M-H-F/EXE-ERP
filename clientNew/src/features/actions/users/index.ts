import ACTIONS from '..'
import apiService from '@api/index'

export const fetchAllUsers = async (token: string) => {
    const { data } = await apiService.GET('/user', token)
    return data
}

export const dispatchGetAllUsers = (res: any) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload: res
    }
}