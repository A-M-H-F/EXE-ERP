import apiService from '@api/index'
import { dispatchGetInternetServices } from '@features/actions/internetServices'
import { AuthState } from '@features/reducers/auth'
import { InternetServiceListState } from '@features/reducers/internetServices'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Switch, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type InternetServiceStatusProps = {
  status: string,
  id: string
}

const status = ({ status, id }: InternetServiceStatusProps) => {
  const token = useSelector((state: TokenState) => state.token)
  const { socketProvider } = useSocket()
  const dispatch = useDispatch()
  const { message: messageApi } = App.useApp()
  const { user: currentUser } = useSelector((state: AuthState) => state.auth)
  const internetServicesList = useSelector((state: InternetServiceListState) => state.internetServicesList)

  const handleUpdate = async (option: boolean) => {
    const newStatus = option === true ? 'active' : 'inactive'
    const body = {
      status: newStatus
    }

    try {
      const { data } = await apiService.PUT(
        `/internet-service/status/${id}`,
        body,
        token
      )

      const { message } = data
      messageApi.open({
        type: 'success',
        content: message,
        duration: 2
      })

      const updatedList = internetServicesList.map((is: any) => {
        if (is._id === id) {
          return { ...is, status: newStatus }
        }
        return is
      })

      dispatch(dispatchGetInternetServices(updatedList))

      socketProvider.emit('getAllInternetServices_to_server',
        {
          userId: currentUser?._id,
        }
      )
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: await error?.response?.data?.message,
      })
    }
  }

  return (
    <Tooltip title={`Status: ${status}`}>
      <Switch
        defaultChecked={status === 'active'}
        checked={status === 'active'}
        onChange={handleUpdate}
        title={status}
        checkedChildren={status}
        unCheckedChildren={status}
      />
    </Tooltip>
  )
}

export default status