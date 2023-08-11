import { CheckIcon, SmallCloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useToast
} from '@chakra-ui/react'
import endUrl from '@utils/endUrl'
import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const initialState = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
}

const showPasswordInitialState = {
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
}

const PasswordRequirement = ({ label, meets }: { meets: boolean; label: string }) => {
    return (
        meets ?
            <Flex color={'green.500'}>
                <CheckIcon mt={1} />
                < Text ml={2} > {label}</Text >
            </Flex >
            :
            <Flex color={'red.500'}>
                <SmallCloseIcon mt={1} />
                <Text ml={2} > {label}</Text>
            </Flex>
    )
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
    { re: /.{6,}/, label: 'At least 6 characters' }
]

const ChangePassword = () => {
    const token = useSelector((state: any) => state.token)
    const toast = useToast()

    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    const [showPasswordInfo, setShowPasswordInfo] = useState<any>(showPasswordInitialState)
    const {
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword
    } = showPasswordInfo

    const handleShowPassword = (name: any) => {
        const value: boolean = !showPasswordInfo[name]

        setShowPasswordInfo({ ...showPasswordInfo, [name]: value })
    }

    const [passwordInfo, setPasswordInfo] = useState(initialState)
    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = passwordInfo
    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setPasswordInfo({ ...passwordInfo, [name]: String(value) })
    }

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(newPassword)} />
    ))

    const handleChangePassword = async () => {
        if (newPassword === '' || confirmPassword === '' || currentPassword === '') {
            toast({
                description: 'Fields are empty.',
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }
        checks.map((check: any) => {
            if (!check?.props?.meets) {
                toast({
                    description: `${check?.props?.label}`,
                    status: 'error',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true
                })
                return
            }
        })
        if (newPassword.indexOf(" ") !== -1) {
            toast({
                description: 'Password should not contain a space.',
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }
        if (newPassword !== confirmPassword) {
            toast({
                description: 'Passwords should match',
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (newPassword === currentPassword) {
            toast({
                description: 'Please choose different passwords',
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        try {
            setIsUpdatingPassword(true)
            const changePassword = await axios.put(`${endUrl}/user/pass`,
                {
                    currentPassword,
                    newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast({
                description: await changePassword?.data?.message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setPasswordInfo(initialState)
            setShowPasswordInfo(showPasswordInitialState)
            setIsUpdatingPassword(false)
        } catch (error: any) {
            setIsUpdatingPassword(false)
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
            <Center>
                <Text fontWeight={700}>Change Password</Text>
            </Center>

            <FormControl id="currentPassword" isRequired>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder="current password"
                        _placeholder={{ color: 'gray.500' }}
                        type={showCurrentPassword ? 'text' : 'password'}
                        name={'currentPassword'}
                        value={currentPassword}
                        onChange={handleInputChange}
                    />
                    <InputRightElement>
                        <Button
                            variant={'ghost'}
                            onClick={() => handleShowPassword('showCurrentPassword')}
                        >
                            {showCurrentPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="newPassword" isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder="new password"
                        _placeholder={{ color: 'gray.500' }}
                        type={showNewPassword ? 'text' : 'password'}
                        name={'newPassword'}
                        value={newPassword}
                        onChange={handleInputChange}
                    />
                    <InputRightElement>
                        <Button
                            variant={'ghost'}
                            onClick={() => handleShowPassword('showNewPassword')}
                        >
                            {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder="confirm password"
                        _placeholder={{ color: 'gray.500' }}
                        type={showConfirmPassword ? 'text' : 'password'}
                        name={'confirmPassword'}
                        value={confirmPassword}
                        onChange={handleInputChange}
                    />
                    <InputRightElement>
                        <Button
                            variant={'ghost'}
                            onClick={() => handleShowPassword('showConfirmPassword')}
                        >
                            {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {checks}
            {confirmPassword !== newPassword && confirmPassword !== '' ?
                <PasswordRequirement label="Match Passwords" meets={confirmPassword == newPassword} />
                : null}

            <Stack spacing={6} direction={['column', 'row']}>
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    w="full"
                    _hover={{
                        bg: 'blue.500',
                    }}
                    isDisabled={isUpdatingPassword}
                    onClick={handleChangePassword}
                >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
            </Stack>
        </>
    )
}

export default ChangePassword