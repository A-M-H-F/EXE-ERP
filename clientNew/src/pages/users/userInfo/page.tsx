import apiService from '@api/index'
import { TokenState } from '@features/reducers/token'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { User } from '@utils/types'
import { App } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserInfoPage = () => {
    useDocumentMetadata('EX - User Info', 'Extreme Engineering - User Info Page')

    // userId
    const { userId } = useParams()

    // state
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()

    // user info
    const [userInfo, setUserInfo] = useState<User>()

    const fetchInfo = async () => {
        try {
            const { data } = await apiService.GET(`/user/${userId}`, token)

            setUserInfo(data)
        } catch (error: any) {
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        if (userId) {
            fetchInfo()
        }
    }, [userId])

    console.log(userInfo)

    return (
        <div>UserInfoPage</div>
    )
}

export default UserInfoPage