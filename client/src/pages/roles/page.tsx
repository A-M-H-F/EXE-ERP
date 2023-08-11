import { Button, Heading, Stack, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { hasPermission } from '@utils/roles/permissionUtils'
import { RolesList } from './components/rolesList'
import useDocumentMetadata from '@hooks/useDocumentMetadata'

const RolesPage = () => {
    useDocumentMetadata('EX - Roles', 'Extreme Engineering - Roles Page')

    // Check permissions
    const { role } = useSelector((state: any) => state.auth)
    const checkCanAddNewRole = hasPermission(role, 'Roles', 'Create')

    return (
        <>
            <VStack>
                <Heading
                    mt={'1em'}
                >
                    Roles
                </Heading>
            </VStack>

            <Stack
                flex={{ base: 1, md: 0 }}
                justify={'flex-end'}
                direction={'row'}
            >
                {checkCanAddNewRole &&
                    <Link to={'/roles/addNew'}>
                        <Button mr={'1em'}
                            bgColor={'#3457D5'}
                            color="#F2F4FA"
                            _hover={{
                                bgColor: '#002fa7',
                            }}
                        >
                            Add New Role
                        </Button>
                    </Link>
                }
            </Stack>

            <RolesList />
        </>
    )
}

export default RolesPage