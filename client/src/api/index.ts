import endUrl from "@utils/endUrl"
import axios from "axios"

export const POST = async (url: string, body: any, token: string) => {
    const { data } = await axios.post(`${endUrl}${url}`,
        {
            ...body
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )

    return { data };
}

export const PUT = async (url: string, body: any, token: string) => {
    const { data } = await axios.put(`${endUrl}${url}`,
        {
            ...body
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )

    return { data };
}

const GET = async (url: string, token: string) => {
    const { data } = await axios.get(`${endUrl}${url}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )

    return { data };
}

const GETWithParams = async (url: string, params: any, token: string) => {
    const { data } = await axios.get(`${endUrl}${url}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                ...params
            },
        }
    )

    return { data };
}

const DELETE = async (url: string, token: string) => {
    const { data } = await axios.delete(`${endUrl}${url}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )

    return { data };
}

const apiService = {
    POST,
    PUT,
    GET,
    DELETE,

    GETWithParams
}

export default apiService;