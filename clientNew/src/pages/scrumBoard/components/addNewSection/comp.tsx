import React, { useState } from 'react'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import { TokenState } from '@features/reducers/token'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Form, Input, Modal, Tooltip } from 'antd'
import apiService from '@api/index'
import { PlusOutlined } from '@ant-design/icons'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { checkWhiteSpaces, isGreaterThan } from '@utils/stringCheck'

type AddNewSectionProps = {
    boardId: string,
    setBoardSections: (section: BoardSectionData[]) => void,
    boardSections: BoardSectionData[],
    boardInfo: BoardInfoData | any,
}

const initialState = {
    title: ''
}

const AddNewSection = ({ boardId, setBoardSections, boardSections, boardInfo }: AddNewSectionProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const { socketProvider } = useSocket()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const initialRef = React.useRef(null)
    const [sectionTitle, setSectionTitle] = useState(initialState)
    const { title } = sectionTitle

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setSectionTitle({ ...sectionTitle, [name]: String(value) })
    }

    const handleAddSection = async (e: any) => {
        e?.preventDefault()

        const nameWhiteSpaceCheck = checkWhiteSpaces(title)
        const titleLengthIsGreater = isGreaterThan(title.length, 20)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Please add a section title',
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

        setIsAdding(true)

        const body = {
            title
        }

        try {
            const { data } = await apiService.POST(`/boards/sections/${boardId}`, body, token)

            const { message, section } = data;

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            if (section) {
                setBoardSections([...boardSections, section])
            }

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('boardSections_to_server', { users: newUsersList })

            setSectionTitle(initialState)
            setIsAdding(false)
            setIsModalOpen(false)
        } catch (error: any) {
            setIsAdding(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            })
        }
    }

    const { screenSizes } = useWindowDimensions()
    const { xs, sm } = screenSizes

    return (
        <>
            <div
                style={{
                    display: xs || sm ? 'flex' : '',
                    justifyContent: 'flex-end'
                }}
            >
                <Tooltip title={'Add new section to board'}>
                    <Button type="primary" onClick={showModal} disabled={isAdding}
                        icon={<PlusOutlined />}
                    >
                        Add new section
                    </Button>
                </Tooltip>
            </div>

            <Modal title="Add New Section"
                open={isModalOpen}
                onOk={handleAddSection}
                confirmLoading={isAdding}
                onCancel={handleCancel}
                okText={'Save'}
                okType='primary'
            >
                <Form
                    layout='vertical'
                >
                    <Form.Item
                        label={'Section Title'}
                        required
                    >
                        <Input
                            ref={initialRef}
                            placeholder='Section title'
                            name='title'
                            onChange={handleInputChange}
                            value={title}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddNewSection