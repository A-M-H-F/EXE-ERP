import endUrl from '@utils/endUrl'
import axios from 'axios'
import ACTIONS from '..'

export const fetchUsersSelection = async (token: string) => {
    const res = await axios.get(`${endUrl}/user/selection`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    })
    return res
}

export const dispatchGetUsersSelection = (res: any) => {
    return {
        type: ACTIONS.GET_USERS_SELECTION,
        payload: res.data
    }
}