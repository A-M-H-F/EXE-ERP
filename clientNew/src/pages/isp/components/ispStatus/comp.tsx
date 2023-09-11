import apiService from '@api/index'
import { dispatchGetISP } from '@features/actions/isp'
import { AuthState } from '@features/reducers/auth'
import { ISP } from '@features/reducers/isp'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Switch, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type IspStatusProps = {
    ispId: string,
    ispStatus: string,
    ispList: ISP[]
}

const IspStatus = ({ ispId, ispStatus, ispList }: IspStatusProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const handleUpdateUserStatus = async (option: boolean) => {
        const newStatus = option === true ? 'active' : 'inactive'
        const body = {
            status: newStatus
        }

        try {
            const { data } = await apiService.PUT(`/isp/status/${ispId}`, body, token)

            const { message } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = ispList.map((isp: ISP) => {
                if (isp._id === ispId) {
                  return { ...isp, status: newStatus }
                }
                return isp
              })

            dispatch(dispatchGetISP(updatedList))

            socketProvider.emit('getAllIsp_to_server', { userId: currentUser?._id })
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            })
        }
    }

    return (
        <Tooltip title={`Status: ${ispStatus}`}>
            <Switch
                defaultChecked={ispStatus === 'active'}
                checked={ispStatus === 'active'}
                onChange={handleUpdateUserStatus}
                title={ispStatus}
                checkedChildren={ispStatus}
                unCheckedChildren={ispStatus}
            />
        </Tooltip>
    )
}

export default IspStatus