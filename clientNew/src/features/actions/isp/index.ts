import { ISP } from '@features/reducers/isp'
import ACTIONS from '..'
import apiService from '@api/index'

export const fetchISP = async (token: string) => {
    const { data } = await apiService.GET('/isp', token)
    return data
}

export const dispatchGetISP = (res: ISP[]) => {
    return {
        type: ACTIONS.GET_ALL_ISP,
        payload: res
    }
}