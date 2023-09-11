import { useState } from 'react'
import { BoardInfoData, BoardSectionData, TaskData } from '../boardInfo/comp'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Modal, Space } from 'antd'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import apiService from '@api/index'
import { DeleteOutlined } from '@ant-design/icons'

type DeleteTaskProps = {
    task: TaskData,
    setBoardSections: (sections: BoardSectionData[]) => void,
    boardSections: BoardSectionData[]
    boardInfo: BoardInfoData | any,
}

const DeleteTask = ({ task, setBoardSections, boardSections, boardInfo }: DeleteTaskProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const isCreator = isBoardCreator(boardInfo?.creator, currentUser?._id)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleOk = () => {
        setIsDeleting(true)
        setTimeout(() => {
            handleDeleteTask()
            setIsModalOpen(false)
        }, 1000)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleDeleteTask = async () => {
        if (!isCreator) {
            setIsDeleting(false)
            return
        }

        setIsDeleting(true)
        try {
            const { data } = await apiService.DELETE(`/boards/sections/tasks/${task._id}`, token)

            const { message } = data;

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const newSections = [...boardSections]
            const sectionIndex = newSections.findIndex(
                (s: BoardSectionData) => s._id === task.section
            )
            const taskIndex = newSections[sectionIndex].tasks.findIndex(
                (t: TaskData) => t._id === task._id
            )
            newSections[sectionIndex].tasks.splice(taskIndex, 1)

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('boardSections_to_server', { users: newUsersList })

            setBoardSections(newSections)
            setIsDeleting(false)
        } catch (error: any) {
            setIsDeleting(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    return (
        <>
            <Space onClick={showModal}>
                <DeleteOutlined />
                Delete Task
            </Space>

            <Modal
                title='Are you sure, you want to delete this Task?'
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                closable={false}
                maskClosable={false}
                confirmLoading={isDeleting}
                okType='danger'
            />
        </>
    )
}

export default DeleteTask