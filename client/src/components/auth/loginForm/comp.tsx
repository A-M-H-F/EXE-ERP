import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import endUrl from '@utils/endUrl'
import { dispatchLogin } from '@features/actions/auth'

const initialState = {
  username: '',
  password: '',
}
const LoginForm = () => {
  const history = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const [authLoginStatus, setAuthLoginStatus] = useState(false)
  const [authLogin, setAuthLogin] = useState(initialState)
  const {
    username,
    password,
  } = authLogin

  const handleChangeInput = (e: any) => {
    const { name, value } = e.target
    if (name === 'username') {
      setAuthLogin({ ...authLogin, [name]: value?.toLowerCase() })
    } else {
      setAuthLogin({ ...authLogin, [name]: value })
    }
  }

  const handleAuthLogin = async (e: any) => {
    e.preventDefault()

    if (username === '' || password === '') {
      toast({
        description: 'Please include all fields.',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      })
      return;
    }
    setAuthLoginStatus(true)
    try {
      const { data } = await axios.post(`${endUrl}/auth/login`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      localStorage.setItem('extreme', String(true))
      dispatch(dispatchLogin())
      toast({
        description: await data?.message,
        status: 'success',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      })

      setAuthLoginStatus(false)
      history('/')
    } catch (error: any) {
      setAuthLoginStatus(false)
      toast({
        description: await error?.response?.data?.message,
        status: 'error',
        duration: 1000,
        position: 'top-right',
        isClosable: true
      })
    }
  }

  return (
    <>
      <Flex
        align={'center'}
        justify={'center'}
      >
        <Stack spacing={8} mx={'auto'} minW={'md'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'} mt={'3em'}>
              Extreme Engineering
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <form onSubmit={(e: any) => handleAuthLogin(e)}>
                <FormControl id="username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text"
                    name='username'
                    onChange={handleChangeInput}
                    placeholder="extreme"
                    value={username}
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel mt={'1em'}>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'}
                      onChange={handleChangeInput}
                      name='password'
                      placeholder='******'
                      value={password} />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Stack spacing={10} pt={10}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={'brand.300'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    isDisabled={authLoginStatus}
                    type='submit'
                  >
                    {authLoginStatus ? 'logging...' : 'Login'}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  )
}

export default LoginForm