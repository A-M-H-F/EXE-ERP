import endUrl from '@utils/endUrl'
import axios from 'axios'
import ACTIONS from '..'

export const fetchBoards = async (token: string) => {
    const res = await axios.get(`${endUrl}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    })
    return res
}

export const dispatchGetBoards = (res: any) => {
    return {
        type: ACTIONS.GET_BOARDS,
        payload: res.data
    }
}

export const fetchFavoriteBoards = async (token: string) => {
    const res = await axios.get(`${endUrl}/boards/status/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    })
    return res
}

export const dispatchGetFavoriteBoards = (res: any) => {
    return {
        type: ACTIONS.GET_FAVORITE_BOARDS,
        payload: res.data
    }
}