import { PlusOutlined } from '@ant-design/icons'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Form, Input, Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import apiService from '@api/index'
import { checkWhiteSpaces, isGreaterThan } from '@utils/stringCheck'

type AddNewTaskProps = {
    sectionId: string,
    setBoardSections: (section: BoardSectionData[]) => void,
    boardSections: BoardSectionData[],
    boardInfo: BoardInfoData | any,
}

const initialState = {
    title: '',
    content: ''
}

const AddNewTask = ({ sectionId, setBoardSections, boardSections, boardInfo }: AddNewTaskProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()

    const initialRef = React.useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const [newTaskData, setNewTaskData] = useState(initialState)
    const { title, content } = newTaskData

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setNewTaskData({ ...newTaskData, [name]: String(value) })
    }

    const handleAddTask = async (e: any) => {
        e?.preventDefault()

        const nameWhiteSpaceCheck = checkWhiteSpaces(title)
        const titleLengthIsGreater = isGreaterThan(title.length, 50)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Please add a task title',
                duration: 2
            })
            return
        }

        if (titleLengthIsGreater) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a short title',
                duration: 2
            })
            return
        }

        const contentWhiteSpaceCheck = checkWhiteSpaces(content)
        if (contentWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Please add a task content',
                duration: 2
            })
            return
        }

        setIsAdding(true)

        const body = {
            title,
            content
        }

        try {
            const { data } = await apiService.POST(`/boards/sections/tasks/${sectionId}`, body, token)

            const { message, newTask } = data;

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const newSections = [...boardSections]
            const index = newSections.findIndex((s: BoardSectionData) => s._id === sectionId)
            newSections[index].tasks.unshift(newTask)
            setBoardSections(newSections)

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('boardSections_to_server', { users: newUsersList })

            setNewTaskData(initialState)
            setIsAdding(false)
            setIsModalOpen(false)
        } catch (error: any) {
            setIsAdding(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    return (
        <>
            <Tooltip title={'Add new task'}>
                <Button icon={<PlusOutlined />} onClick={showModal} />
            </Tooltip>

            <Modal
                title="Add New Task"
                open={isModalOpen}
                onOk={handleAddTask}
                onCancel={handleCancel}
                centered
                confirmLoading={isAdding}
                okText={'Add'}
            >
                <Form
                    layout='vertical'
                >
                    <Form.Item
                        label={'Title'}
                        required
                    >
                        <Input
                            ref={initialRef}
                            placeholder='Task title'
                            name='title'
                            onChange={handleInputChange}
                            value={title}
                        />
                    </Form.Item>

                    <Form.Item
                        label={'Content'}
                        required
                    >
                        <Input.TextArea
                            placeholder='Task content'
                            name='content'
                            onChange={handleInputChange}
                            value={content}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddNewTask