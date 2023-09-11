import endUrl from '@utils/endUrl'
import ACTIONS from '..'
import axios from 'axios'

export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN,
    }
}

export const dispatchLogout = () => {
    return {
        type: ACTIONS.LOGOUT,
    }
}

export const fetchUserInfo = async (token: any) => {
    const res = await axios.get(`${endUrl}/user/info`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    })
    return res
}

export const dispatchGetUser = (res: any) => {
    return {
        type: ACTIONS.GET_USER,
        payload: {
            user: res.data,
            role: res.data.role
        }
    }
}