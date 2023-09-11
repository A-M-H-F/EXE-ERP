import { useState, useEffect } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useDispatch } from 'react-redux'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Space, Tooltip } from 'antd'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import TextArea from 'antd/es/input/TextArea'
import { EditOutlined } from '@ant-design/icons'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { checkWhiteSpaces, isGreaterThan } from '@utils/stringCheck'

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const BoardDescription = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const initialState = {
        description: boardInfo?.description
    }
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

    const [isUpdating, setIsUpdating] = useState(false)

    const [newDescription, setNewDescription] = useState(initialState)
    const { description } = newDescription
    const handleChangeInput = (e: any) => {
        const { name, value } = e.target

        setNewDescription({ ...newDescription, [name]: String(value) })
    }

    useEffect(() => {
        setNewDescription(initialState)
    }, [boardInfo])

    const handleUpdateDescription = async (e: any) => {
        e?.preventDefault()

        if (description === boardInfo?.description) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a unique description',
                duration: 2
            })
            return
        }

        const nameWhiteSpaceCheck = checkWhiteSpaces(description)
        const lengthIsGreater = isGreaterThan(description.length, 300)
        if (lengthIsGreater) {
            messageApi.open({
                type: 'error',
                content: 'Please write a short description',
                duration: 2
            })
            return
        }

        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Description should not contain only whitespace',
                duration: 2
            })
            return
        }

        const body = {
            description
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/boards/description/${boardInfo?._id}`, body, token)

            const { message, newBoardInfo, standardBoards, favoriteBoards } = data;

            setBoardInfo(newBoardInfo)
            messageApi.open({
                type: 'success',
                content: message
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('updateBoard_to_server', { users: newUsersList })

            setIsUpdating(false)
        } catch (error: any) {
            setIsUpdating(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    const { screenSizes } = useWindowDimensions()
    const { xs, sm } = screenSizes

    return (
        <>
            <Tooltip title='Edit Board Description'>

                <Space.Compact style={{
                    width: '100%',
                    alignItems: 'center',
                    display: xs || sm ? 'block' : 'flex',
                    justifyContent: 'space-between'
                }}>
                    <TextArea
                        value={description}
                        name='description'
                        placeholder='Board Description...'
                        maxLength={300}
                        onChange={handleChangeInput}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        style={{
                            maxWidth: '100%',
                            marginTop: '1em',
                            marginBottom: '1em',
                        }}
                    />
                    <Button type="primary" style={{ marginLeft: '1em' }} loading={isUpdating}
                        onClick={handleUpdateDescription}
                        icon={<EditOutlined />}
                    >
                        Update
                    </Button>
                </Space.Compact>
            </Tooltip>
        </>
    )
}

export default BoardDescription