
import {
    Box,
    useColorModeValue,
    Divider,
    useToast,
    AbsoluteCenter,
    Flex,
} from '@chakra-ui/react'
import {
    dispatchGetBoards,
    dispatchGetFavoriteBoards,
    fetchBoards,
    fetchFavoriteBoards
} from '@features/actions/scrumBoards'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BoardLink, { BoardLinkProps } from '../boardLink/comp'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import apiService from '@api/index'
import { generateResponseBody } from '@api/helpers'
import { AddNewBoard } from '../addNew'

const ScrumBoardSideBar = () => {
    const dispatch = useDispatch()
    const token = useSelector((state: any) => state.token)
    const favoriteBoards = useSelector((state: any) => state.favoriteBoards)
    const boards = useSelector((state: any) => state.boards)

    const toast = useToast()

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

            toast({
                description: message,
                status: 'success',
                duration: 1000,
                position: 'top-right',
                isClosable: true
            })
        } catch (error: any) {
            toast({
                description: await error?.response?.data?.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
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

            toast({
                description: message,
                status: 'success',
                duration: 1000,
                position: 'top-right',
                isClosable: true
            })
        } catch (error: any) {
            toast({
                description: await error?.response?.data?.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
        }
    }

    return (
        <Box
            minH="100%"
            p={'2'}
            boxShadow={'lg'}
            // bg={useColorModeValue('gray.100', 'gray.900')}
            bgColor={'#3457D5'}
            color={'#F2F4FA'}
        >
            <Flex justifyContent={'right'}>
                <AddNewBoard />
            </Flex>
            <Box position='relative' padding='10'>
                <Divider bg={useColorModeValue('gray.100', 'gray.900')} />
                <AbsoluteCenter
                    bgColor='#002fa7'
                    px='4'
                    color={'#F2F4FA'}
                    borderRadius={5}
                    fontSize={'16px'}
                >
                    Favorites
                </AbsoluteCenter>
            </Box>

            <DragDropContext onDragEnd={onDragEndFavorites}>
                <Droppable
                    key={'list-board-favorites-droppable-key'}
                    droppableId={'list-board-favorites-droppable'}
                >
                    {(provided) => (
                        <Box p={'2'} ref={provided.innerRef} {...provided.droppableProps}>
                            {favoriteBoards?.map((board: BoardLinkProps, index: any) => (
                                <Draggable key={board._id} draggableId={board._id} index={index}>
                                    {(provided) => (
                                        <Box
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
                                        </Box>

                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <Box position='relative' padding='10'>
                <Divider bg={useColorModeValue('gray.100', 'gray.900')} />
                <AbsoluteCenter
                    bgColor='#002fa7'
                    px='4'
                    color={'#F2F4FA'}
                    borderRadius={5}
                    fontSize={'16px'}
                >
                    Boards
                </AbsoluteCenter>
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    key={'list-board-droppable-key'}
                    droppableId={'list-board-droppable'}
                >
                    {(provided) => (
                        <Box p={'2'} ref={provided.innerRef} {...provided.droppableProps}>
                            {boards?.map((board: BoardLinkProps, index: any) => (
                                <Draggable key={board._id} draggableId={board._id} index={index}>
                                    {(provided) => (
                                        <Box
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
                                        </Box>

                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    )
}

export default ScrumBoardSideBar