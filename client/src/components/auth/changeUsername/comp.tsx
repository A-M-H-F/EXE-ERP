import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
    ButtonGroup,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchGetUser } from '@features/actions/auth'
import apiService from '@api/index'
import { generateResponseBody } from '@api/helpers'

const ChangeUsername = ({ user }: any) => {
    const initialState = {
        userName: user?.username
    }
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const dispatch = useDispatch()

    const [userInfo, setUserInfo] = useState(initialState)
    const { userName } = userInfo
    const handleUsernameChange = (e: any) => {
        const { name, value } = e.target

        setUserInfo({ ...userInfo, [name]: String(value?.toLowerCase()) })
    }

    // editable
    const [isEditable, setIsEditable] = useState(false)

    const [isUpdating, setIsUpdating] = useState(false)

    const handleCancelEdit = (e: any) => {
        e?.preventDefault()

        setUserInfo(initialState)
        setIsEditable(false)
    }

    const handleUpdateUserName = async (e: any) => {
        e?.preventDefault()

        if (user?.username === userName) {
            toast({
                description: 'Please choose a unique username.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (userName?.trim() === '' || userName === ' ') {
            toast({
                description: 'Username should not contain only whitespace.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (userName?.length <= 3) {
            toast({
                description: 'Username must be at least 4 characters long.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        const isValidUsername = /^[a-z]+$/.test(userName);

        if (!isValidUsername) {
            toast({
                description: 'Username can only contain lowercase letters (a-z).',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            });
            return;
        }

        const body = {
            username: userName
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/user/username`, body, token)

            const { message, newUserInfo } = data;

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })

            setIsEditable(false)
            setIsUpdating(false)
            dispatch(dispatchGetUser(generateResponseBody(newUserInfo)))
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
            <FormControl id="userName">
                <FormLabel>User Name</FormLabel>
                <Flex alignItems={'center'}>
                    <Input
                        placeholder="UserName"
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        name='userName'
                        onChange={handleUsernameChange}
                        value={userName}
                        readOnly={!isEditable}
                        borderColor={isEditable ? 'brand.300' : 'inherit'}
                        _hover={{
                            borderColor: isEditable ? 'brand.300' : ''
                        }}
                    />

                    {!isEditable &&
                        <IconButton
                            ml={'2em'}
                            colorScheme='green'
                            size='sm'
                            icon={<EditIcon />}
                            aria-label='editUsername'
                            onClick={() => setIsEditable(true)}
                        />
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
                                onClick={handleUpdateUserName}
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

export default ChangeUsername