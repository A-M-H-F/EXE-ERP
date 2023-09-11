import { useState, useEffect } from 'react'
import { BoardInfoData, BoardSectionData, TaskData } from '../boardInfo/comp'
import { AuthState } from '@features/reducers/auth'
import { useSelector } from 'react-redux'
import { App, Card, Dropdown, Form, Input, Modal, Space, Typography } from 'antd'
import { useSocket } from '@socket/provider/socketProvider'
import { TokenState } from '@features/reducers/token'
import apiService from '@api/index'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import { MenuProps } from 'antd/lib'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import { TaskEditHistory } from '../taskEditHistory'
import { TaskMoveHistory } from '../taskMoveHistory'
import { DeleteTask } from '../deleteTask'

type SectionTaskProps = {
    task: TaskData,
    setBoardSections: (sections: BoardSectionData[]) => void,
    boardSections: BoardSectionData[],
    boardInfo: BoardInfoData | any,
}

const SectionTask = ({ task, setBoardSections, boardSections, boardInfo }: SectionTaskProps) => {
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const [isCreator, setIsCreator] = useState(false)

    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()

    const initialState = {
        title: task?.title,
        content: task?.content
    }

    const [isUpdating, setIsUpdating] = useState(false)

    const [newTaskData, setNewTaskData] = useState(initialState)
    const { title, content } = newTaskData
    const handleChangeInput = (e: any) => {
        const { name, value } = e.target

        setNewTaskData({ ...newTaskData, [name]: String(value) })
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setNewTaskData(initialState)
        setIsModalOpen(false)
    }

    useEffect(() => {
        setNewTaskData(initialState)
    }, [task])

    const handleUpdateTask = async (e: any) => {
        e?.preventDefault()

        if (title === task.title && content === task.content) {
            messageApi.open({
                type: 'error',
                content: 'Please write a different title and content'
            })
            setIsUpdating(false)
            return;
        }

        setIsUpdating(true)

        const body = {
            title,
            content
        }

        try {
            const { data } = await apiService.PUT(`/boards/sections/tasks/info/${task._id}`, body, token)

            const { message } = data
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

            const newTask = {
                ...task,
                title,
                content
            }

            newSections[sectionIndex].tasks[taskIndex] = newTask
            setBoardSections(newSections)

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('boardSections_to_server', { users: newUsersList })

            setIsUpdating(false)
            handleCancel()
        } catch (error: any) {
            setIsUpdating(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    useEffect(() => {
        const isCreator = isBoardCreator(task?.creator?._id, currentUser?._id)
        setIsCreator(isCreator)
    }, [task])

    const items: MenuProps['items'] = [
        {
            label: (
                <Space onClick={showModal}>
                    <EditOutlined />
                    <Typography>
                        Edit Task
                    </Typography>
                </Space>
            ),
            key: '0',
        },
        {
            label: (
                <TaskEditHistory task={task} />
            ),
            key: '1',
        },
        {
            label: (
                <TaskMoveHistory task={task} />
            ),
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <DeleteTask
                    task={task}
                    setBoardSections={setBoardSections}
                    boardSections={boardSections}
                    boardInfo={boardInfo}
                />
            ),
            key: '4',
            disabled: !isCreator,
            danger: true
        },
    ]

    const menuProps = {
        items
    };

    return (
        <>
            <Card
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography>
                            {task?.title}
                        </Typography>

                        <Dropdown
                            menu={menuProps} trigger={['click', 'hover']}
                        >
                            <SettingOutlined />
                        </Dropdown>
                    </div>
                }
            >
                COMMENTS - add comment - coming soon
            </Card>

            <Modal
                title="Task"
                open={isModalOpen}
                onOk={handleUpdateTask}
                onCancel={handleCancel}
                centered
                confirmLoading={isUpdating}
            >
                <Form
                    layout='vertical'
                >
                    <Form.Item label={'Title'}>
                        <Input
                            onChange={handleChangeInput}
                            value={title}
                            name="title"
                        />
                    </Form.Item>

                    <Form.Item label={'Content'}>
                        <Input.TextArea
                            onChange={handleChangeInput}
                            value={content}
                            name="content"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SectionTask