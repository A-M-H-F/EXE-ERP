import { useState, useEffect } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useDispatch } from 'react-redux'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Input, Tooltip } from 'antd'
import { checkWhiteSpaces, isGreaterThan } from '@utils/stringCheck'

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const BoardTitle = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const initialState = {
        title: boardInfo?.title
    }

    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

    const [isUpdating, setIsUpdating] = useState(false)

    const [newTitle, setNewTitle] = useState(initialState)
    const { title } = newTitle
    const handleChangeTitle = (e: any) => {
        const { name, value } = e.target

        setNewTitle({ ...newTitle, [name]: String(value) })
    }

    useEffect(() => {
        setNewTitle(initialState)
    }, [boardInfo])

    const handleUpdateTitle = async (e: any) => {
        e?.preventDefault()

        if (title === boardInfo?.title) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a unique title'
            })
            return
        }

        const nameWhiteSpaceCheck = checkWhiteSpaces(title)
        const titleLengthIsGreater = isGreaterThan(title.length, 20)
        if (titleLengthIsGreater) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a short title'
            })
            return
        }

        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Title should not contain only whitespace'
            })
            return
        }

        const body = {
            title
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/boards/title/${boardInfo?._id}`, body, token)

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

    return (
        <>
            <Tooltip title='Change Board Title'>
                <Input placeholder="Board Title"
                    value={title}
                    onChange={handleChangeTitle}
                    name='title'
                    bordered={true}
                    onPressEnter={handleUpdateTitle}
                    disabled={isUpdating}
                    maxLength={15}
                />
            </Tooltip>
        </>
    )
}

export default BoardTitle