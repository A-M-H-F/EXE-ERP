import Icon, { PlusOutlined } from '@ant-design/icons'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { dispatchGetBoards } from '@features/actions/scrumBoards'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { icons } from '@pages/scrumBoard/utils/icons'
import { useSocket } from '@socket/provider/socketProvider'
import { User } from '@utils/types'
import { App, Badge, Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SelectUser } from '../selectUser'
import { checkWhiteSpaces, isGreaterThan } from '@utils/stringCheck'
import { UsersSelectionListState } from '@features/reducers/usersSelection'

const { Option } = Select
const { TextArea } = Input

const initialState = {
    title: '',
    description: '',
    icon: Object.keys(icons)[0],
}

const AddNewBoard = () => {
    const token = useSelector((state: TokenState) => state.token)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const { message: messageApi } = App.useApp()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const initialRef = React.useRef(null)

    const usersSelection = useSelector((state: UsersSelectionListState) => state.usersSelection)

    useEffect(() => {
        if (token) {
            fetchUsersSelection(token).then((res: any) => {
                dispatch(dispatchGetUsersSelection(res))
            })
        }
    }, [token])

    const [newBoardData, setNewBoardData] = useState(initialState)
    const {
        title,
        description,
        icon,
    } = newBoardData

    const [selectedUsers, setSelectedUsers] = useState<any>([])

    const handleSelectUser = (users: any) => {
        const newList = users?.map((u: any) => (
            {
                user: u
            }
        ))

        if (!newList?.some((u: any) => u?.user === currentUser?._id)) {
            newList?.push({ user: currentUser?._id })
        }

        setSelectedUsers(newList)
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setNewBoardData({ ...newBoardData, [name]: String(value) })
    }

    const handleSelectIcon = (icon: any) => {
        setNewBoardData({ ...newBoardData, ['icon']: String(icon) })
    }

    const handleCreateBoard = async () => {
        const nameWhiteSpaceCheck = checkWhiteSpaces(title)
        const titleLengthIsGreater = isGreaterThan(title.length, 15)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Please add a board name'
            })
            return
        }

        if (titleLengthIsGreater) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a short title'
            })
            return
        }

        let usersList = [...selectedUsers]
        if (usersList?.length <= 0) {
            usersList = [{ user: currentUser?._id }]
        }

        try {
            setIsAdding(true)
            const body = {
                title,
                description,
                icon,
                users: usersList
            }

            const { data } = await apiService.POST('/boards', body, token)

            const { message, boardId, boards } = data

            messageApi.open({
                type: 'success',
                content: message
            })

            dispatch(dispatchGetBoards(generateResponseBody(boards)))

            // send socket event
            const newUsersList = usersList.filter((user: any) => user?.user !== currentUser?._id)
            socketProvider.emit('addNewBoard_to_server', { users: newUsersList })

            navigate(`/boards/${boardId}`)
            setIsAdding(false)
            setNewBoardData(initialState)
            setIsModalOpen(false)
        } catch (error: any) {
            setIsAdding(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Button type="text" onClick={showModal} icon={<PlusOutlined />}
                style={{
                    color: 'white',
                    marginTop: '0.2em'
                }}
            >
                New Board
            </Button>
            <Modal
                centered
                title="Add New Board"
                open={isModalOpen}
                onOk={handleCreateBoard}
                onCancel={handleCancel}
                okText={'Save'}
            >
                <Spin spinning={isAdding}>
                    <Form
                        layout='vertical'
                    >
                        <Form.Item
                            label={'Title'}
                        >
                            <Input
                                ref={initialRef}
                                placeholder='Board title'
                                name='title'
                                onChange={handleInputChange}
                                value={title}
                                maxLength={15}
                            />
                        </Form.Item>

                        <Form.Item
                            label={'Description'}
                        >
                            <TextArea
                                maxLength={500}
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                placeholder='Board description'
                                name='description'
                                onChange={handleInputChange}
                                value={description}
                            />
                        </Form.Item>

                        <Form.Item
                            label={'Users'}
                        >
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="select users"
                                onChange={handleSelectUser}
                                optionLabelProp="label"
                                defaultValue={[currentUser?._id]}
                            >
                                {usersSelection?.map((user: User) => (
                                    <Option
                                        value={user?._id}
                                        label={user?.name}
                                        key={user?._id}
                                        disabled={currentUser?._id === user?._id}
                                    >
                                        <SelectUser
                                            user={user}
                                        />
                                    </Option>
                                ))}

                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={'Icon'}
                        >
                            <Row gutter={[16, 16]}>
                                {Object.keys(icons)?.map((iconT: any, index: number) => (
                                    <Col
                                        key={index}
                                        onClick={() => handleSelectIcon(iconT)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: 'none'
                                        }}
                                        className="hoverable-col"
                                    >
                                        <Badge
                                            dot={iconT === icon}
                                            color='gold'
                                        >
                                            <Icon
                                                component={icons[iconT] as React.ForwardRefExoticComponent<any>}
                                                style={{
                                                    fontSize: '28px',
                                                    color: iconT === icon ? 'blue' : '',
                                                    backgroundColor: 'none'
                                                }}
                                            />
                                        </Badge>
                                    </Col>
                                ))}
                            </Row>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}

export default AddNewBoard