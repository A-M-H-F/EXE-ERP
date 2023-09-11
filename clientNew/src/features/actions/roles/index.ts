import endUrl from '@utils/endUrl'
import axios from 'axios'
import ACTIONS from '..'

export const fetchRoles = async (token: string) => {
    const res = await axios.get(`${endUrl}/role`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    })
    return res
}

export const dispatchGetRoles = (res: any) => {
    return {
        type: ACTIONS.GET_ROLES,
        payload: res.data
    }
}