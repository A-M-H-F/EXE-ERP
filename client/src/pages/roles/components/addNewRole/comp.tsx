import { useState } from 'react';
import {
    Checkbox,
    CheckboxGroup,
    Button,
    Text,
    Heading,
    FormControl,
    Input,
    Flex,
    Stack,
    Center,
    Box,
    SimpleGrid,
    useToast
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { crudPermissions, pages } from '@utils/pages';
import apiService from '@api/index';
import { useNavigate } from 'react-router-dom';

interface SelectedPage {
    id: number;
    name: string;
    crudPermissions: string[];
}

type Page = {
    id: number,
    name: string
}

const initialState = {
    roleName: ''
}

const AddNewRole = () => {
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const navigate = useNavigate()

    const [selectedPages, setSelectedPages] = useState<SelectedPage[]>([])
    const [roleInfo, setRoleInfo] = useState(initialState)
    const [addingNewRole, setAddingNewRole] = useState<boolean>(false)

    const {
        roleName
    } = roleInfo

    // Handle role name change
    const handleRoleNameChange = (e: any) => {
        const { name, value } = e.target

        setRoleInfo({ ...roleInfo, [name]: String(value) })
    }

    // Handle page selection
    const handlePageSelect = (page: Page) => {
        setSelectedPages((prevSelected) => {
            if (prevSelected.find((selectedPage) => selectedPage.id === page.id)) {
                // Page is already selected, remove it
                return prevSelected.filter((selectedPage) => selectedPage.id !== page.id)
            } else {
                // Page is not selected, add it with empty CRUD permissions
                return [...prevSelected, { id: page.id, name: page.name, crudPermissions: [] }]
            }
        })
    }

    // Handle CRUD checkbox selection for each page
    const handleCRUDSelect = (pageId: number, permission: string) => {
        setSelectedPages((prevSelected) => {
            return prevSelected.map((page) => {
                if (page.id === pageId) {
                    const updatedCrudPermissions = page.crudPermissions.includes(permission)
                        ? page.crudPermissions.filter((item) => item !== permission)
                        : [...page.crudPermissions, permission]
                    return { ...page, crudPermissions: updatedCrudPermissions }
                }
                return page
            })
        })
    }

    const handleSaveRole = async () => {
        if (roleName === '' || roleName.trim() === '') {
            toast({
                description: `Please add a role name`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (roleName.length < 3) {
            toast({
                description: `Role name length should be at least 3 letters`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (selectedPages.length <= 0) {
            toast({
                description: `Please select at least one page, with it's permissions`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (selectedPages.some((page) => page.crudPermissions.length <= 0)) {
            toast({
                description: `Please select at least one permission for the page selected`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }


        const access = selectedPages.map((page) => ({
            page: page.name,
            crudPermissions: page.crudPermissions,
        }))

        try {
            setAddingNewRole(true)
            const body = {
                name: roleName,
                access
            }
            const { data } = await apiService.POST('/role', body, token)

            const { message } = data

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            setRoleInfo(initialState)
            setSelectedPages([])
            setAddingNewRole(false)
            navigate('/roles')
        } catch (error: any) {
            setAddingNewRole(false)
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
        <Stack spacing={4}>
            <Box>
                <Box
                    bgColor={'brand.300'}
                    ml={'1em'}
                    mr={'1em'}
                    borderRadius={5}
                    p={2}
                    mt={'2em'}
                >
                    <Center>
                        <Heading
                            mt={'1em'} color="#F2F4FA"
                            fontWeight={'medium'}
                        >
                            Add New Role
                        </Heading>
                    </Center>
                    <FormControl>
                        <Flex alignItems="center" mt={'1em'} mb={'1em'}>
                            <Text
                                ml="1em"
                                mr="1em"
                                fontWeight="medium"
                                fontSize={'18px'} color="#F2F4FA"
                            >
                                Role Name:
                            </Text>
                            <Input
                                type="text"
                                name="roleName"
                                placeholder="role name"
                                size="md"
                                width="12em"
                                onChange={handleRoleNameChange}
                                value={roleName}
                                color="#F2F4FA"
                                _focus={{
                                    borderColor: '#F2F4FA',
                                    _placeholder: {
                                        color: 'transparent',
                                    },
                                }}
                                _placeholder={{
                                    color: 'black'
                                }}
                            />
                        </Flex>
                    </FormControl>
                </Box>
            </Box>

            <Box>
                <SimpleGrid
                    spacing={5}
                    ml={{ base: '1em', lg: '1em' }}
                    mr={{ base: '1em', lg: '1em' }}
                    columns={{ base: 1, lg: 2, xl: 3 }}
                >
                    <CheckboxGroup>
                        {pages.map((page) => (
                            <Box key={page.id}
                                bgColor={'brand.300'}
                                color="#F2F4FA"
                                borderRadius={5}
                                p={4}
                                boxShadow={'dark-lg'}
                                _hover={{
                                    bgColor: '#1B3D81',
                                    color: '#F2F4FA'
                                }}
                            >
                                <Stack spacing={2} mb={'2em'}>
                                    <Checkbox
                                        isChecked={selectedPages.some((p) => p.id === page.id)}
                                        onChange={() => handlePageSelect(page)}
                                        colorScheme='green'
                                    >
                                        {page.name}
                                    </Checkbox>
                                    <CheckboxGroup>
                                        <Box>
                                            <Flex
                                                ml={'1.8em'}
                                                mt={'1em'}
                                            >
                                                <Text mr={'1em'}>
                                                    Permissions:
                                                </Text>
                                                {crudPermissions.map((permission) => (
                                                    <Checkbox
                                                        colorScheme='green'
                                                        mr={'1em'}
                                                        key={`${page.id}-${permission.name}`}
                                                        isChecked={
                                                            selectedPages.some(
                                                                (p) => p.id === page.id
                                                                    && p.crudPermissions?.includes(permission.name)
                                                            )
                                                        }
                                                        onChange={() => handleCRUDSelect(page.id, permission.name)}
                                                        isDisabled={!selectedPages.some((p) => p.id === page.id)}
                                                    >
                                                        {permission.name}
                                                    </Checkbox>
                                                ))}
                                            </Flex>

                                            <Flex
                                                ml={'1.8em'}
                                                mt={'1em'}
                                            >
                                                <Text mr={'1em'}>
                                                    Additional:
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </CheckboxGroup>
                                </Stack>
                            </Box>
                        ))}
                    </CheckboxGroup>
                </SimpleGrid>
            </Box>

            <Stack
                flex={{ base: 1, md: 0 }}
                justify={'center'}
                direction={'row'}
                spacing={1}
                ml={1}>
                <Button
                    onClick={handleSaveRole}
                    isDisabled={
                        addingNewRole
                    }
                    mr={'1em'}
                    mb={'5em'}
                    mt={'2em'}
                    bgColor={'brand.300'}
                    color="#F2F4FA"
                    borderRadius={5}
                    p={5}
                    boxShadow={'dark-lg'}
                    _hover={{
                        bgColor: '#1B3D81'
                    }}
                    w={{ base: '', lg: ''}}
                >
                    {addingNewRole ? 'Saving...' : 'Save Role'}
                </Button>
            </Stack>
        </Stack>
    );
};

export default AddNewRole