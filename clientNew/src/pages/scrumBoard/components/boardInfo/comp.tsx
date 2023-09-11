import { AuthState } from "@features/reducers/auth";
import { TokenState } from "@features/reducers/token";
import { useSocket } from "@socket/provider/socketProvider";
import { User } from "@utils/types";
import { App, Button, Divider, Skeleton, Space } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react'
import apiService from "@api/index";
import { ScrumBoardHeader } from "../header";
import { BoardDescription } from "../boardDescription";
import { AddNewSection } from "../addNewSection";
import { BoardUsers } from "../boardUsers";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { BoardSection } from "../boardSection";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useWindowDimensions } from "@hooks/useWindowDimensions";


export interface BoardUserInfo {
    user: {
        name: string;
        _id: string;
        picture: string;
    };
}

export type BoardInfoData = {
    _id: string,
    creator: string,
    users: BoardUserInfo[],
    icon: string,
    title: string,
    description: string
}

export type BoardSectionData = {
    _id: string,
    title: string,
    boardId: string,
    tasks: TaskData[]
}

export type TaskEditHistoryData = {
    _id: string,
    title: string,
    content: string,
    editedBy: User,
    date: Date,
}

export type TaskData = {
    _id: string,
    section: string,
    title: string,
    content: string,
    position: number,
    editHistory: TaskEditHistoryData[],
    creator: User,
    updatedBy: User,
    moveHistory: TaskMoveHistoryData[]
}

export type TaskMoveHistoryData = {
    _id: string,
    from: string,
    to: string,
    date: Date,
    movedBy: User
}

const BoardInfo = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const navigate = useNavigate()

    const { message: messageApi } = App.useApp()
    const { boardId }: string | any = useParams()

    const [boardInfo, setBoardInfo] = useState<BoardInfoData>()

    const [boardSections, setBoardSections] = useState<BoardSectionData[]>([])

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [boardId])

    const handleGetBoardInfo = async () => {
        try {
            const { data } = await apiService.GET(`/boards/${boardId}`, token)

            setBoardInfo(data)
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    const getBoardSections = async () => {
        try {
            const { data } = await apiService.GET(`/boards/sections/${boardId}`, token)

            setBoardSections(data)
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        socketProvider.on('boardSections_to_client', async function ({
        }) {
            await getBoardSections()
        });

        socketProvider.on('updateBoard_to_client', async function ({
        }) {
            await handleGetBoardInfo()
        });

        socketProvider.on('updateBoardUsers_to_client', async function ({
            fromBoard
        }) {
            if (boardId !== undefined && fromBoard === boardId) {
                try {
                    const { data } = await apiService.GET(`/boards/${boardId}`, token)
                    const checkUser = data?.users?.some((user: any) => user?.user?._id === currentUser?._id)

                    if (!checkUser) {
                        navigate('/boards')
                    }
                } catch (error: any) {
                    messageApi.open({
                        type: 'error',
                        content: '',
                        duration: 1
                    })
                }
            }
        });

        return () => {
            socketProvider.off("boardSections_to_client", getBoardSections);
            socketProvider.off("updateBoard_to_client", handleGetBoardInfo);
        }
    }, [socketProvider])

    useEffect(() => {
        if (boardId !== '' || boardId !== undefined) {
            socketProvider.emit("joinRoom", currentUser?._id);

            handleGetBoardInfo()

            getBoardSections()
        }
    }, [boardId])

    const onDragEnd = async ({ source, destination }: any) => {
        if (!destination) return

        const sourceColIndex = boardSections.findIndex(e => e._id === source.droppableId)
        const destinationColIndex = boardSections.findIndex(e => e._id === destination.droppableId)
        const sourceCol = boardSections[sourceColIndex]
        const destinationCol = boardSections[destinationColIndex]

        const sourceSectionId = sourceCol._id
        const sourceSectionName = sourceCol.title
        const destinationSectionId = destinationCol._id
        const destinationSectionName = destinationCol.title

        const sourceTasks = [...sourceCol.tasks]
        const destinationTasks = [...destinationCol.tasks]

        if (source.droppableId !== destination.droppableId) {
            const [removed] = sourceTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            boardSections[sourceColIndex].tasks = sourceTasks
            boardSections[destinationColIndex].tasks = destinationTasks

            const body = {
                sourceTasks,
                destinationTasks,
                sourceSectionId,
                destinationSectionId,
                sourceSectionName,
                destinationSectionName
            }

            try {
                const { data } = await apiService.PUT(`/boards/sections/tasks/positions`, body, token)

                const { message } = data

                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 1
                })

                // send socket event
                const newUsersList = boardInfo?.users?.map((user: any) => {
                    return {
                        user: user?.user?._id
                    }
                })?.filter((u: any) => u?.user !== currentUser?._id)
                socketProvider.emit('boardSections_to_server', { users: newUsersList })
            } catch (error: any) {
                messageApi.open({
                    type: 'error',
                    content: await error?.response?.data?.message,
                })
            }
        } else {
            const [removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            boardSections[destinationColIndex].tasks = destinationTasks

            if (JSON.stringify(sourceTasks) === JSON.stringify(destinationTasks)) {
                return;
            }

            const body = {
                newTasksPositions: destinationTasks
            }

            try {
                const { data } = await apiService.PUT(`/boards/sections/tasks/insider`, body, token)

                const { message } = data

                messageApi.open({
                    type: 'success',
                    content: message,
                    duration: 1
                })

                // send socket event
                const newUsersList = boardInfo?.users?.map((user: any) => {
                    return {
                        user: user?.user?._id
                    }
                })?.filter((u: any) => u?.user !== currentUser?._id)
                socketProvider.emit('boardSections_to_server', { users: newUsersList })
            } catch (error: any) {
                messageApi.open({
                    type: 'error',
                    content: await error?.response?.data?.message,
                })
            }
        }
    }

    /* Section (Left - Right) Scroll */
    const containerRef = useRef<any>(null)
    const [scrollInterval, setScrollInterval] = useState<any>(null)

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -200,
                behavior: 'smooth',
            })
        }
    }

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: 200,
                behavior: 'smooth',
            })
        }
    }

    const handleMouseDown = (scrollFunction: any) => {
        setScrollInterval(setInterval(scrollFunction, 200))
    }

    const handleMouseUp = () => {
        clearInterval(scrollInterval)
    }

    const { screenSizes } = useWindowDimensions()
    const { xs, sm } = screenSizes

    return (
        <>
            <div
                style={{
                    padding: 10
                }}
            >
                <ScrumBoardHeader
                    boardInfo={boardInfo} setBoardInfo={setBoardInfo}
                />

                <Skeleton loading={isLoading}
                    style={{
                        borderRadius: 5,
                        padding: 0,
                        marginTop: '1em'
                    }}
                    active
                >
                    <div
                        style={{
                            minHeight: '4em',
                            paddingInline: 10,
                            borderRadius: 5,
                            boxShadow: '5px 5px darkgray',
                            backgroundColor: 'white',
                            border: 'solid 1px dodgerblue',
                            marginLeft: '2px',
                            marginTop: '1em'
                        }}
                    >
                        <BoardDescription boardInfo={boardInfo} setBoardInfo={setBoardInfo} />

                        {xs || sm ?
                            <Divider />
                            : null}

                        <div
                            style={{
                                display: xs || sm ? 'block' : 'flex',
                                justifyContent: 'space-between',
                                marginTop: '1em',
                                marginBottom: '1em',
                            }}
                        >
                            <BoardUsers boardInfo={boardInfo} setBoardInfo={setBoardInfo} />

                            <AddNewSection
                                boardId={boardId}
                                setBoardSections={setBoardSections}
                                boardSections={boardSections}
                                boardInfo={boardInfo}
                            />
                        </div>
                    </div>
                </Skeleton>

                <div
                    style={{
                        marginTop: '1em',
                        marginBottom: '1em',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        aria-label='scroll-left'
                        icon={<AiOutlineArrowLeft />}
                        onMouseDown={() => handleMouseDown(scrollLeft)}
                        onMouseUp={handleMouseUp}
                        onTouchStart={() => handleMouseDown(scrollLeft)}
                        onTouchEnd={handleMouseUp}
                        onClick={scrollLeft}
                        style={{
                            marginRight: '0.5em'
                        }}
                    />
                    <Button
                        aria-label='scroll-right'
                        icon={<AiOutlineArrowRight />}
                        onMouseDown={() => handleMouseDown(scrollRight)}
                        onMouseUp={handleMouseUp}
                        onTouchStart={() => handleMouseDown(scrollRight)}
                        onTouchEnd={handleMouseUp}
                        onClick={scrollRight}
                    />
                </div>

                <Skeleton loading={isLoading}
                    style={{
                        borderRadius: 5,
                        padding: 0,
                        marginTop: '1em'
                    }}
                    active
                >
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div
                            ref={containerRef}
                            style={{
                                marginTop: '0.5em',
                                borderRadius: 5,
                                padding: 5,
                                overflowX: 'hidden',
                            }}
                        >
                            <Space direction='horizontal'>
                                {boardSections?.map((section: BoardSectionData) => (
                                    <Droppable key={section?._id} droppableId={section?._id}>
                                        {(provided) => (
                                            <div
                                                key={section?._id}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                <BoardSection
                                                    section={section}
                                                    boardInfo={boardInfo}
                                                    setBoardSections={setBoardSections}
                                                    boardSections={boardSections}
                                                />

                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </Space>
                        </div>
                    </DragDropContext>
                </Skeleton>
            </div>
        </>
    )
}

export default BoardInfo