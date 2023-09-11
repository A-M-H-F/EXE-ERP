import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import {
    dispatchGetBoards,
    dispatchGetFavoriteBoards,
    fetchBoards,
    fetchFavoriteBoards
} from '@features/actions/scrumBoards'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Divider, Typography } from 'antd'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AddNewBoard } from '../addNew'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import BoardLink, { BoardLinkProps } from '../boardLink/comp'

const { Text } = Typography

const ScrumBoardSideBar = () => {
    const dispatch = useDispatch()
    const token = useSelector((state: TokenState) => state.token)
    const favoriteBoards = useSelector((state: any) => state.favoriteBoards)
    const boards = useSelector((state: any) => state.boards)
    const { socketProvider } = useSocket()
    const { message: messageApi } = App.useApp()

    useEffect(() => {
        const handleFetchBoards = async () => {
            fetchBoards(token).then((res: any) => {
                dispatch(dispatchGetBoards(res))
            })
        }

        socketProvider.on('addNewBoard_to_client', async function ({
        }) {
            await handleFetchBoards()
        });

        socketProvider.on('deleteBoard_to_client', async function ({
        }) {
            await handleFetchBoards()
        });

        socketProvider.on('updateBoard_to_client', async function ({
        }) {
            await handleFetchBoards()
        });

        socketProvider.on('updateBoardUsers_to_client', async function ({
        }) {
            await handleFetchBoards()
        });

        return () => {
            socketProvider.off("addNewBoard_to_client", handleFetchBoards);
            socketProvider.off("deleteBoard_to_client", handleFetchBoards);
            socketProvider.off("updateBoard_to_client", handleFetchBoards);
            socketProvider.off("updateBoardUsers_to_client", handleFetchBoards);
        }
    }, [socketProvider])

    useEffect(() => {
        if (token) {
            fetchBoards(token).then((res: any) => {
                dispatch(dispatchGetBoards(res))
            })
            fetchFavoriteBoards(token).then((res: any) => {
                dispatch(dispatchGetFavoriteBoards(res))
            })
        }
    }, [token])

    const onDragEndFavorites = async ({ source, destination }: any) => {
        if (!destination) {
            return; // No valid destination, exit the function
        }

        const newList = [...favoriteBoards]

        if (newList?.length <= 1) {
            return;
        }

        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        if (JSON.stringify(newList) === JSON.stringify(favoriteBoards)) {
            return;
        }

        dispatch(dispatchGetFavoriteBoards(generateResponseBody(newList)))

        const newBoards = newList.map((board: any, index: any) => (
            {
                board: board._id,
                favoritePosition: index
            }
        ))

        try {
            const body = {
                boards: newBoards
            }
            const { data } = await apiService.PUT('/boards/favoritePosition', body, token)

            const { message } = data

            messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 3
            })
        }
    }

    const onDragEnd = async ({ source, destination }: any) => {
        if (!destination) {
            return; // No valid destination, exit the function
        }

        const newList = [...boards]

        if (newList?.length <= 1) {
            return;
        }

        const [removed] = newList.splice(source.index, 1)
        newList.splice(destination.index, 0, removed)

        if (JSON.stringify(newList) === JSON.stringify(boards)) {
            return;
        }

        dispatch(dispatchGetBoards(generateResponseBody(newList)))

        const newBoards = newList.map((board: any, index: any) => (
            {
                board: board._id,
                position: index
            }
        ))

        try {
            const body = {
                boards: newBoards
            }
            const { data } = await apiService.PUT('/boards/position', body, token)

            const { message } = data

            messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
                duration: 3
            })
        }
    }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'right',
                    margin: 2
                }}
            >
                <AddNewBoard />
            </div>

            <div
                style={{
                    padding: 10
                }}
            >
                <Divider>
                    <Text
                        style={{
                            color: '#F2F4FA',
                            padding: 2,
                        }}
                    >
                        Favorites
                    </Text>
                </Divider>

                <DragDropContext onDragEnd={onDragEndFavorites}>
                    <Droppable
                        key={'list-board-favorites-droppable-key'}
                        droppableId={'list-board-favorites-droppable'}
                    >
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {favoriteBoards?.map((board: BoardLinkProps, index: any) => (
                                    <Draggable key={board._id} draggableId={board._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                            >
                                                <BoardLink
                                                    key={board?._id}
                                                    title={board?.title}
                                                    _id={board?._id}
                                                    icon={board?.icon}
                                                    favorite={true}
                                                />
                                            </div>

                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <div
                style={{
                    padding: 10
                }}
            >
                <Divider>
                    <Text
                        style={{
                            color: '#F2F4FA',
                            padding: 2,
                        }}
                    >
                        Boards
                    </Text>
                </Divider>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        key={'list-board-droppable-key'}
                        droppableId={'list-board-droppable'}
                    >
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {boards?.map((board: BoardLinkProps, index: any) => (
                                    <Draggable key={board._id} draggableId={board._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                            >
                                                <BoardLink
                                                    key={board?._id}
                                                    title={board?.title}
                                                    _id={board?._id}
                                                    icon={board?.icon}
                                                    favorite={false}
                                                />
                                            </div>

                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    )
}

export default ScrumBoardSideBar