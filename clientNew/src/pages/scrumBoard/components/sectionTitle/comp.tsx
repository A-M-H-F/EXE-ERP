import { useState, useEffect } from 'react'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Input, Tooltip } from 'antd'
import apiService from '@api/index'
import { checkWhiteSpaces, isGreaterThan } from '@utils/stringCheck'

type SectionTitleProps = {
    sectionInfo: BoardSectionData | any,
    boardInfo: BoardInfoData,
    setBoardSections: (section: BoardSectionData[]) => void,
    boardSections: BoardSectionData[]
}

const SectionTitle = ({
    sectionInfo, boardInfo, setBoardSections, boardSections }: SectionTitleProps) => {
    const initialState = {
        title: sectionInfo?.title
    }

    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
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
    }, [sectionInfo])

    const handleUpdateTitle = async (e: any) => {
        e?.preventDefault()

        if (title === sectionInfo?.title) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a unique title',
                duration: 2
            })
            return
        }

        const nameWhiteSpaceCheck = checkWhiteSpaces(title)
        const titleLengthIsGreater = isGreaterThan(title.length, 20)
        if (titleLengthIsGreater) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a short title',
                duration: 2
            })
            return
        }

        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Title should not contain only whitespace',
                duration: 2
            })
            return
        }

        const body = {
            title
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/boards/sections/title/${sectionInfo?._id}`, body, token)

            const { message } = data;

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const newSections = [...boardSections]
            const index = newSections.findIndex((s: BoardSectionData) => s._id === sectionInfo?._id)
            newSections[index].title = title
            setBoardSections(newSections)

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('boardSections_to_server', { users: newUsersList })

            setIsUpdating(false)
        } catch (error: any) {
            setIsUpdating(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    return (
        <>
            <Tooltip title={'Section Title'}>
                <Input placeholder="Section Title"
                    value={title}
                    onChange={handleChangeTitle}
                    name='title'
                    bordered={true}
                    onPressEnter={handleUpdateTitle}
                    disabled={isUpdating}
                    maxLength={20}
                />
            </Tooltip>
        </>
    )
}

export default SectionTitle