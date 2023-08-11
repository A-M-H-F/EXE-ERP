import apiService from '@api/index'
import { useEffect, useState } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { ButtonGroup, Flex, FormControl, IconButton, Textarea, useToast } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { generateResponseBody } from '@api/helpers'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { useDispatch } from 'react-redux'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const BoardDescription = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const initialState = {
        description: boardInfo?.description
    }
    const { user: currentUser } = useSelector((state: any) => state.auth)
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const dispatch = useDispatch()

    // editable
    const [isEditable, setIsEditable] = useState(false)

    const [isUpdating, setIsUpdating] = useState(false)

    const [newDescription, setNewDescription] = useState(initialState)
    const { description } = newDescription
    const handleChangeTitle = (e: any) => {
        const { name, value } = e.target

        setNewDescription({ ...newDescription, [name]: String(value) })
    }

    useEffect(() => {
        setNewDescription(initialState)
    }, [boardInfo])

    const handleCancelEdit = (e: any) => {
        e?.preventDefault()

        setNewDescription(initialState)
        setIsEditable(false)
    }

    const handleUpdateTitle = async (e: any) => {
        e?.preventDefault()

        if (description === boardInfo?.description) {
            toast({
                description: 'Please choose a unique description.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (description?.length > 300) {
            toast({
                description: 'Please choose a short description.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (description?.trim() === '' || description === ' ') {
            toast({
                description: 'Description should not contain only whitespace.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
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
            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))

            setIsEditable(false)
            setIsUpdating(false)
        } catch (error: any) {
            setIsUpdating(false)
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
        <>
            <FormControl id="boardTitle">
                {/* <FormLabel>Board Description</FormLabel> */}
                <Flex alignItems={'center'}>
                    <Textarea
                        placeholder="Description"
                        _placeholder={{ color: 'gray.500' }}
                        // type="text"
                        name='description'
                        onChange={handleChangeTitle}
                        value={description || ''}
                        readOnly={!isEditable}
                        borderColor={isEditable ? 'brand.300' : 'inherit'}
                        _hover={{
                            borderColor: isEditable ? 'brand.300' : ''
                        }}
                    />

                    {!isEditable && isBoardCreator(boardInfo?.creator, currentUser?._id) ?
                        <IconButton
                            ml={'1em'}
                            colorScheme='green'
                            size='sm'
                            icon={<EditIcon />}
                            aria-label='editUsername'
                            onClick={() => setIsEditable(true)}
                        />
                        : null
                    }

                    {isEditable &&
                        <ButtonGroup
                            justifyContent='center'
                            size='sm'
                            ml={'1em'}
                        >
                            <IconButton
                                icon={<CheckIcon />}
                                aria-label='CheckIcon'
                                colorScheme='green'
                                onClick={handleUpdateTitle}
                                isDisabled={isUpdating}
                            />

                            <IconButton
                                icon={<CloseIcon />}
                                aria-label='CloseIcon'
                                colorScheme='red'
                                onClick={handleCancelEdit}
                            />
                        </ButtonGroup>
                    }
                </Flex>
            </FormControl>
        </>
    )
}

export default BoardDescription