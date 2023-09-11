import { DeleteOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetISP } from '@features/actions/isp'
import { AuthState } from '@features/reducers/auth'
import { ISP } from '@features/reducers/isp'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { hasPermission } from '@utils/roles/permissionUtils'
import { App, Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type DeleteIspProps = {
  ispId: string,
  ispList: ISP[]
}

const DeleteIsp = ({ ispId, ispList }: DeleteIspProps) => {
  const token = useSelector((state: TokenState) => state.token)
  const { role } = useSelector((state: AuthState) => state.auth)
  const { socketProvider } = useSocket()
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state: AuthState) => state.auth)
  const { message: messageApi } = App.useApp()
  const [open, setOpen] = useState(false)

  const [deleting, setDeleting] = useState<boolean>(false)

  const handleDeleteRole = async () => {
    const checkPermission = hasPermission(role, 'Internet Service Providers', 'Delete')
    if (!checkPermission) {
      messageApi.open({
        type: 'error',
        content: `You don't have permission to delete this ISP`
      })
      return
    }

    try {
      setDeleting(true)
      const { data } = await apiService.DELETE(`/isp/${ispId}`, token)
      const { message } = data

      messageApi.open({
        type: 'success',
        content: message,
        duration: 2
      })

      const updatedList = [...ispList].filter((isp: ISP) => isp?._id !== ispId)

      dispatch(dispatchGetISP(updatedList))

      socketProvider.emit('getAllIsp_to_server', { userId: currentUser?._id })

      setDeleting(false)
      setOpen(false)
    } catch (error: any) {
      setDeleting(false)
      await messageApi.open({
        type: 'error',
        content: await error?.response?.data?.message,
        duration: 3
      })
    }
  }

  const showModal = () => {
    setOpen(true)
  }

  const handleCancel = () => {
    messageApi.open({
      type: 'success',
      content: 'Cancelled',
      duration: 1
    })
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="Delete ISP">
        <DeleteOutlined onClick={showModal} style={{ color: 'red' }} />
      </Tooltip>
      <Modal
        title="Are you sure, you want to delete this ISP?"
        open={open}
        onOk={handleDeleteRole}
        okType='danger'
        confirmLoading={deleting}
        onCancel={handleCancel}
        centered
        closable={false}
      />
    </>
  )
}

export default DeleteIsp