import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChangePassword } from '@components/auth/changePassword'
import { ChangeProfilePicture } from '@components/auth/changeProfilePicture'
import { ChangeUsername } from '@components/auth/changeUsername'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
  useDocumentMetadata('EX - Profile', 'Extreme Engineering - Profile Page')
  const { user, role } = useSelector((state: any) => state.auth)

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Profile
          </Heading>

          <ChangeProfilePicture />

          <FormControl id="fullName">
            <FormLabel>Full Name</FormLabel>
            <Input
              _placeholder={{ color: 'gray.500' }}
              type="text"
              readOnly
              value={user?.name}
              onChange={(e: any) => e}
            />
          </FormControl>

          <FormControl id="role">
            <FormLabel>Role</FormLabel>
            <Input
              _placeholder={{ color: 'gray.500' }}
              type="text"
              readOnly
              value={role?.name}
              onChange={(e: any) => e}
            />
          </FormControl>

          <ChangeUsername user={user} />

          <Divider />

          <ChangePassword />
        </Stack>
      </Flex>
    </>
  )
}

export default ProfilePage