import { useState } from 'react'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import apiService from '@api/index'
import { TokenState } from '@features/reducers/token'
import { useSelector } from 'react-redux'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import { AuthState } from '@features/reducers/auth'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Modal, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

type DeleteSectionProps = {
    sectionInfo: BoardSectionData | any,
    boardInfo: BoardInfoData,
    setBoardSections: (sections: BoardSectionData[]) => void,
    boardSections: BoardSectionData[],
}

const DeleteSection = ({
    sectionInfo, boardInfo, setBoardSections, boardSections }: DeleteSectionProps) => {
    const { message: messageApi } = App.useApp()
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const isCreator = isBoardCreator(boardInfo?.creator, currentUser?._id)
    const { socketProvider } = useSocket()

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleOk = () => {
        setIsDeleting(true)
        setTimeout(() => {
            handleDeleteSection()
            setIsModalOpen(false)
        }, 1000)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleDeleteSection = async () => {
        if (!isCreator) {
            setIsDeleting(false)
            return
        }

        setIsDeleting(true)
        try {
            const { data } = await apiService.DELETE(`/boards/sections/${sectionInfo?._id}`, token)

            const { message } = data;

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const newSections = [...boardSections].filter(
                (s: BoardSectionData) => s._id !== sectionInfo?._id
            )

            setBoardSections(newSections)

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('boardSections_to_server', { users: newUsersList })

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
            {isCreator &&
                <Tooltip title="Delete Section">
                    <Button
                        onClick={showModal}
                        type="primary"
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                    />
                </Tooltip>
            }

            <Modal
                title='Are you sure, you want to delete this Section?'
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

export default DeleteSection