import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    VStack,
    Flex,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dispatchGetRoles, fetchRoles } from '@features/actions/roles'

const RolesList = () => {
    const token = useSelector((state: any) => state.token)
    const roles = useSelector((state: any) => state.roles)
    const dispatch = useDispatch()

    useEffect(() => {
        fetchRoles(token).then((res: any) => {
            dispatch(dispatchGetRoles(res))
        })
    }, [])

    return (
        <VStack>
            <TableContainer
                mr={'1em'}
                borderRadius={5}
                borderWidth={'1px'}
                mt={'2em'}
                ml={'1em'}
                width={'50%'}
            >
                <Table
                    variant='simple'
                >
                    <TableCaption>Roles - Total: {roles?.length}</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>
                                Name
                            </Th>
                            <Th>
                                Setting
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {roles && roles?.map((role: any) => (
                            <Tr key={role?._id}>
                                <Td>
                                    {role?.name}
                                </Td>
                                <Td>
                                    <Flex>
                                        <Link to={`/roles/${role?._id}`}>
                                            View
                                        </Link>

                                        <Link to={`/roles/${role?._id}`}>
                                            Delete
                                        </Link>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    )
}

export default RolesList