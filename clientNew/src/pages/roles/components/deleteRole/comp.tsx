import { DeleteOutlined } from '@ant-design/icons'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { dispatchGetRoles } from '@features/actions/roles'
import { TokenState } from '@features/reducers/token'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Tooltip, App, Modal } from 'antd'
import { hasPermission } from '@utils/roles/permissionUtils'
import { AuthState } from '@features/reducers/auth'

type DeleteRoleProps = {
    roleId: string
}

const DeleteRole = ({ roleId }: DeleteRoleProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { role } = useSelector((state: AuthState) => state.auth)
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()
    const [open, setOpen] = useState(false)

    const [deletingRole, setDeletingRole] = useState<boolean>(false)

    const handleDeleteRole = async () => {
        const checkPermission = hasPermission(role, 'Roles', 'Delete')
        if (!checkPermission) {
            messageApi.open({
                type: 'error',
                content: `You don't have permission to delete this role`
            })
            return
        }

        if (role?._id === roleId) {
            messageApi.open({
                type: 'error',
                content: 'This role, is assigned to user/s'
            })
            return;
        }

        try {
            setDeletingRole(true)
            const { data } = await apiService.DELETE(`/role/${roleId}`, token)
            const { message, newRolesList } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })

            dispatch(dispatchGetRoles(generateResponseBody(newRolesList)))
            setDeletingRole(false)
            setOpen(false)
        } catch (error: any) {
            setDeletingRole(false)
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
            <Tooltip title="Delete Role">
                <DeleteOutlined onClick={showModal} style={{ color: 'red' }} />
            </Tooltip>
            <Modal
                title="Are you sure, you want to delete this Role?"
                open={open}
                onOk={handleDeleteRole}
                okType='danger'
                confirmLoading={deletingRole}
                onCancel={handleCancel}
                centered
                // maskClosable={false}
                closable={false}
            />
        </>
    )
}

export default DeleteRole