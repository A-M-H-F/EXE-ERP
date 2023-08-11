import {
  Box,
  Flex,
  useColorModeValue,
  Spacer,
  useColorMode,
  Button,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { SideBar } from '@layout/sideBar'
import { ProfileMenu } from '@components/auth/profileMenu'

const Header = () => {
  const auth = useSelector((state: any) => state.auth)
  const { isLogged } = auth
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>

        {isLogged ? <SideBar /> : null}

        <Spacer />
        <Button onClick={toggleColorMode} mr={isLogged ? '1em' : ''}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        {isLogged ? <ProfileMenu /> : null}

        {/* To be checked down */}
        {/* <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}> */}
        {/* <IconButton
                    onClick={onToggleNavbar}
                    icon={
                        isOpenNavbar ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                    }
                    variant={'ghost'}
                    aria-label={'Toggle Navigation'}
                /> */}
        {/* <Image
                    src={logo}
                    alt='main logo'
                    w={'80px'}
                    h={'35px'}
                    mt={1}
                /> */}
        {/* </Flex> */}
        {/* {width >= 770 ? <Flex>
                <Image
                    src={logo}
                    alt='main logo'
                    w={'80px'}
                    h={'35px'}
                    mt={1}
                />
            </Flex> : null} */}

        {/* <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-start'}
          direction={'row'}
          spacing={1}
          ml={1}>
          {isLogged ? <SideBar /> : null}
          <Spacer />
          <ProfileMenu />
        </Stack> */}
      </Flex>
    </Box>
  )
}

export default Header