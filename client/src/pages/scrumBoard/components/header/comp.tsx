import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    IconButton,
    Skeleton,
    Spacer,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardInfoData } from '../boardInfo/comp'
import { BoardTitle } from '../boardTitle'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import apiService from '@api/index'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { generateResponseBody } from '@api/helpers'
import { useDispatch } from 'react-redux'
import { AiOutlineDelete } from 'react-icons/ai'
import { BoardIcon } from '../boardIcon'

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const ScrumBoardHeader = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const { boardId } = useParams()
    const history = useNavigate()
    const toast = useToast()
    const { user: currentUser } = useSelector((state: any) => state.auth)
    const token = useSelector((state: any) => state.token)
    const dispatch = useDispatch()
    const isCreator = isBoardCreator(boardInfo?.creator, currentUser?._id)

    const handleCloseBoard = () => {
        history('/boards')
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<any>()
    const [isLoaded, setIsLoaded] = useState(false)

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleDeleteBoard = async () => {
        if (!isCreator) return;

        setIsDeleting(true)
        try {
            const { data } = await apiService.DELETE(`/boards/${boardInfo?._id}`, token)

            const { message, standardBoards, favoriteBoards } = data;

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))
            history('/boards')
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

    useEffect(() => {
        setIsLoaded(false)
        setTimeout(() => {
            setIsLoaded(true)
        }, 2000)
    }, [boardId])

    return (
        <>
            <Skeleton isLoaded={isLoaded} borderRadius={5}>
                <Box
                    minH={'4em'}
                    p={'3'}
                    boxShadow={'lg'}
                    borderRadius={5}
                >
                    <Flex flexDirection={'row'}>
                        {isCreator &&
                            <BoardIcon
                                boardInfo={boardInfo} setBoardInfo={setBoardInfo}
                            />
                        }
                        <BoardTitle boardInfo={boardInfo} setBoardInfo={setBoardInfo} />

                        <Spacer />

                        {isCreator &&
                            <IconButton
                                icon={<AiOutlineDelete />}
                                aria-label='delete-board'
                                color='red'
                                onClick={onOpen}
                                fontSize={'20px'}
                            />
                        }

                        {boardId ?
                            <Button ml={'0.5em'} onClick={handleCloseBoard} colorScheme='red'>
                                Close Board
                            </Button>
                            : null
                        }
                    </Flex>
                </Box>
            </Skeleton>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Board
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                isDisabled={isDeleting}
                                colorScheme='red'
                                onClick={handleDeleteBoard}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ScrumBoardHeader