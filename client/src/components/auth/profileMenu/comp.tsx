import {
    Box,
    Flex,
    Avatar,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Stack,
    Center,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { Logout } from '../logout'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineUser } from 'react-icons/ai'
import useProfilePicture from '@utils/images/useProfilePicture'

const ProfileMenu = () => {
    const { user, role } = useSelector((state: any) => state.auth)
    const currentPath = useLocation()
    const pathName = currentPath.pathname

    return (
        <>
            <Box>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
                                        icon={user?.picture === '' ? <AiOutlineUser fontSize='1.5rem' /> : undefined}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
                                            icon={user?.picture === '' ? <AiOutlineUser fontSize='1.5rem' /> : undefined}
                                        />
                                    </Center>
                                    <br />

                                    <Center>
                                        <Text
                                            fontWeight={700}
                                        >
                                            {user?.name}
                                        </Text>
                                    </Center>

                                    <MenuDivider />

                                    <MenuItem
                                        fontWeight={700}
                                        closeOnSelect={false}
                                        color={'brand.300'}
                                    >
                                        Role: {role?.name}
                                    </MenuItem>

                                    {
                                        pathName === '/profile'
                                            ?
                                            <MenuItem
                                                closeOnSelect={false}
                                            >
                                                Account Settings
                                            </MenuItem>
                                            :
                                            <Link to={'/profile'}>
                                                <MenuItem>
                                                    Account Settings
                                                </MenuItem>
                                            </Link>
                                    }

                                    <Logout />
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default ProfileMenu