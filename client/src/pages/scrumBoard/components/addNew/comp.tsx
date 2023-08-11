import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Skeleton,
    Textarea,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchGetBoards } from '@features/actions/scrumBoards'
import { icons } from '@pages/scrumBoard/utils/icons'
import { BiAddToQueue } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import apiService from '@api/index'
import { generateResponseBody } from '@api/helpers'
import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { SelectUser } from '../selectUser'
import { User } from '@utils/types'
import { isBoardCurrentUser } from '@pages/scrumBoard/utils/user'

const initialState = {
    title: '',
    description: '',
    icon: Object.keys(icons)[0],
}

const AddNewBoard = () => {
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user: currentUser } = useSelector((state: any) => state.auth)

    const usersSelection = useSelector((state: any) => state.usersSelection)

    useEffect(() => {
        if (token) {
            fetchUsersSelection(token).then((res: any) => {
                dispatch(dispatchGetUsersSelection(res))
            })
        }
    }, [token])

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const {
        isOpen: isOpenCreateBoard,
        onOpen: onOpenCreateBoard,
        onClose: onCloseCreateBoard
    } = useDisclosure()

    const [newBoardData, setNewBoardData] = useState(initialState)
    const {
        title,
        description,
        icon,
    } = newBoardData

    const [selectedUsers, setSelectedUsers] = useState<any>([])

    const handleSelectUser = (userId: string) => {
        // Check if the user is already selected
        const isUserSelected = selectedUsers.some((user: any) => user.user === userId);

        if (isUserSelected) {
            // Remove the user from selectedUsers
            const updatedUsers = selectedUsers.filter((user: any) => user.user !== userId);
            setSelectedUsers(updatedUsers);
        } else {
            // Add the user to selectedUsers
            setSelectedUsers([...selectedUsers, { user: userId }]);
        }
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setNewBoardData({ ...newBoardData, [name]: String(value) })
    }

    const handleSelectIcon = (icon: any) => {
        setNewBoardData({ ...newBoardData, ['icon']: String(icon) })
    }

    const handleCreateBoard = async () => {
        if (title === '' || title.trim() === '') {
            toast({
                description: `Please add a board name`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (title?.length > 15) {
            toast({
                description: 'Please choose a short title.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        const usersList = [
            ...selectedUsers,
            { user: currentUser?._id }
        ]

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

            toast({
                description: message,
                status: 'success',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })

            dispatch(dispatchGetBoards(generateResponseBody(boards)))

            navigate(`/boards/${boardId}`)
            setIsAdding(false)
            setNewBoardData(initialState)
            onCloseCreateBoard()
        } catch (error: any) {
            setIsAdding(false)
            toast({
                description: await error?.response?.data?.message,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
        }
    }

    return (
        <>
            <IconButton
                variant='ghost'
                color='white'
                bgColor={'#3457D5'}
                aria-label='favorite-nan'
                fontSize='2.1em'
                p={'2'}
                icon={<BiAddToQueue />}
                _hover={{
                    bg: '#002fa7',
                    color: 'white',
                    borderRadius: 10
                }}
                onClick={onOpenCreateBoard}
            />

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpenCreateBoard}
                onClose={onCloseCreateBoard}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Board</ModalHeader>
                    <ModalBody pb={6}>
                        <Skeleton isLoaded={!isAdding}>
                            <FormControl>
                                <FormLabel>Title</FormLabel>
                                <Input
                                    ref={initialRef}
                                    placeholder='Board title'
                                    name='title'
                                    onChange={handleInputChange}
                                    value={title}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Description</FormLabel>
                                <Input
                                    as={Textarea}
                                    placeholder='Board description'
                                    name='description'
                                    onChange={handleInputChange}
                                    value={description}
                                />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Icon</FormLabel>

                                <SimpleGrid columns={9} spacing={4}>
                                    {Object.keys(icons)?.map((iconT: any, index: number) => (
                                        <Box
                                            key={index}
                                            onClick={() => handleSelectIcon(iconT)}
                                            _hover={{
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Icon
                                                as={icons[iconT]}
                                                boxSize={7}
                                                color={icon === iconT ? 'blue' : 'gray.400'}
                                                bg={'none'}
                                            />
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Users</FormLabel>
                                <Menu closeOnSelect={false}>
                                    <MenuButton as={Button} colorScheme='blue'>
                                        Select Users
                                    </MenuButton>

                                    <MenuList minWidth='220px' maxHeight='200px' overflowY='auto'>
                                        {usersSelection?.map((user: User) => (
                                            <MenuItem
                                                key={user?._id}
                                                onClick={() => handleSelectUser(user?._id)}
                                                isDisabled={isBoardCurrentUser(user?._id, currentUser?._id)}
                                            >
                                                <SelectUser
                                                    user={user}
                                                    currentUser={currentUser}
                                                    selectedUsers={selectedUsers}
                                                />
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </FormControl>
                        </Skeleton>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} isDisabled={isAdding} onClick={handleCreateBoard}>
                            {isAdding ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={onCloseCreateBoard}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddNewBoard