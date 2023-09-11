import { DeleteOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetActiveLocations, dispatchGetLocations } from '@features/actions/locations'
import { AuthState } from '@features/reducers/auth'
import { Location } from '@features/reducers/locations'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { hasPermission } from '@utils/roles/permissionUtils'
import { App, Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

type DeleteLocationProps = {
    id: string,
    locationsList: Location[],
    activeLocationsList: Location[],
}

const DeleteLocation = ({ id, locationsList, activeLocationsList }: DeleteLocationProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser, role } = useSelector((state: AuthState) => state.auth)
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()
    const [open, setOpen] = useState(false)

    const [deleting, setDeleting] = useState<boolean>(false)

    const handleDeleteLocation = async () => {
        const checkPermission = hasPermission(role, 'Locations', 'Delete')
        if (!checkPermission) {
            messageApi.open({
                type: 'error',
                content: `You don't have permission to delete this Address`
            })
            return
        }

        try {
            setDeleting(true)
            const { data } = await apiService.DELETE(`/address/${id}`, token)
            const { message } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })

            const updatedList = locationsList?.filter((location: Location) => location._id !== id)
            const activeUpdatedList = activeLocationsList?.filter((location: Location) => location._id !== id)
            dispatch(dispatchGetLocations(updatedList))
            dispatch(dispatchGetActiveLocations(activeUpdatedList))

            socketProvider.emit('getLocations_to_server',
                {
                    userId: currentUser?._id,
                }
            )

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
            <Tooltip title="Delete Address">
                <DeleteOutlined onClick={showModal} style={{ color: 'red' }} />
            </Tooltip>
            <Modal
                title="Are you sure, you want to delete this Address?"
                open={open}
                onOk={handleDeleteLocation}
                okType='danger'
                confirmLoading={deleting}
                onCancel={handleCancel}
                centered
                // maskClosable={false}
                closable={false}
            />
        </>
    )
}

export default DeleteLocation