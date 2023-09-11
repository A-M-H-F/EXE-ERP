import { SecurityScanOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { RoleData } from '@pages/roles/roleInfo/page'
import { useSocket } from '@socket/provider/socketProvider'
import { crudPermissions, pages } from '@utils/pages'
import { hasPermission } from '@utils/roles/permissionUtils'
import { checkLength, checkWhiteSpaces } from '@utils/stringCheck'
import { App, Button, Card, Checkbox, Col, Input, Row, Skeleton, Space, Spin, Tooltip, Typography } from 'antd'
import { useState, useEffect } from 'react'
import { MdKeyboardReturn } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const { Text } = Typography

type UpdateRoleProps = {
    roleInfo: RoleData
}

type Page = {
    id: number,
    page: string
}

interface SelectedPage {
    id: number;
    page: string;
    crudPermissions: string[];
}

const UpdateRole = ({ roleInfo }: UpdateRoleProps) => {
    const navigate = useNavigate()
    const token = useSelector((state: TokenState) => state.token)
    const { role } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const { message: messageApi } = App.useApp()

    const initialState: RoleData = {
        _id: roleInfo?._id,
        name: roleInfo?.name,
        access: roleInfo?.access,
        createdAt: roleInfo?.createdAt,
        updatedAt: roleInfo?.updatedAt,
    }

    const [updatedRoleInfo, setUpdatedRoleInfo] = useState<RoleData>(initialState)
    const [selectedPages, setSelectedPages] = useState<SelectedPage[]>(initialState.access)
    const [updatingRole, setUpdatingRole] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState(true)

    const {
        name
    } = updatedRoleInfo

    // Handle role name change
    const handleRoleNameChange = (e: any) => {
        const { name, value } = e.target

        setUpdatedRoleInfo({ ...updatedRoleInfo, [name]: String(value) })
    }

    // Handle page selection
    const handlePageSelect = (page: Page) => {
        setSelectedPages((prevSelected: any) => {
            if (prevSelected.find((selectedPage: SelectedPage) => selectedPage.page === page.page)) {
                // Page is already selected, remove it
                return prevSelected.filter((selectedPage: SelectedPage) => selectedPage.page !== page.page)
            } else {
                // Page is not selected, add it with empty CRUD permissions
                return [...prevSelected, { id: page.id, page: page.page, crudPermissions: [] }]
            }
        })

        const isChecked = selectedPages.some((p) => p.id === page.id)
        if (isChecked) {
            messageApi.open({
                type: 'success',
                content: `${page.page} page removed`,
                duration: 1
            })
        } else {
            messageApi.open({
                type: 'success',
                content: `${page.page} page added`,
                duration: 1
            })
        }
    }

    const handleCRUDSelect = (pageName: string, permission: string) => {
        setSelectedPages((prevSelected) => {
            return prevSelected.map((page) => {
                if (page.page === pageName) {
                    const updatedCrudPermissions = page.crudPermissions.includes(permission)
                        ? page.crudPermissions.filter((item) => item !== permission)
                        : [...page.crudPermissions, permission]
                    return { ...page, crudPermissions: updatedCrudPermissions }
                }
                return page
            })
        })
    }

    const handleUpdateRole = async () => {
        const nameWhiteSpaceCheck = checkWhiteSpaces(name)
        const nameLength = checkLength(name, 2)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: `Please add a role name`
            })
            return
        }

        if (nameLength) {
            messageApi.open({
                type: 'error',
                content: `Role name length should be at least 3 letters`
            })
            return
        }

        if (selectedPages.length <= 0) {
            messageApi.open({
                type: 'error',
                content: `Please select at least one page, with it's permissions`
            })
            return
        }

        if (selectedPages.some((page) => page.crudPermissions.length <= 0)) {
            messageApi.open({
                type: 'error',
                content: `Please select at least one permission for the page selected`
            })
            return
        }

        const access = selectedPages?.map((page) => ({
            page: page.page,
            crudPermissions: page.crudPermissions,
        }))

        const body = {
            name: name,
            access
        }

        setUpdatingRole(true);
        try {
            const { data } = await apiService.PUT(`/role/${roleInfo?._id}`, body, token)

            const { message } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            socketProvider.emit('updateRole_to_server', { role: roleInfo?._id })

            setUpdatingRole(false)
            navigate('/roles')
        } catch (error: any) {
            setUpdatingRole(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        setUpdatedRoleInfo(initialState)
        setSelectedPages(initialState.access)
        setTimeout(() => {
            setIsLoaded(false)
        }, 500)
    }, [roleInfo])

    return (
        <Spin spinning={updatingRole}>
            <Card
                title={
                    <div
                        style={{
                            marginBottom: '1em'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography
                                style={{
                                    marginTop: '1em',
                                    fontSize: '18px'
                                }}
                            >
                                Add New Role
                            </Typography>

                            <Link to={'/roles'}>
                                <Button
                                    style={{
                                        marginTop: '1em',
                                        color: 'green'
                                    }}
                                    icon={<MdKeyboardReturn />}
                                >
                                    Return To Roles List
                                </Button>
                            </Link>
                        </div>
                        <Space
                            style={{
                                alignItems: 'center'
                            }}
                        >
                            <Input
                                onChange={handleRoleNameChange}
                                value={name}
                                type="text"
                                name="name"
                                prefix={<SecurityScanOutlined />}
                                placeholder="role name"
                                style={{
                                    marginTop: '1em',
                                    width: 'auto'
                                }}
                            />

                            {hasPermission(role, 'Roles', 'Update') ?
                                <Tooltip title='Update Role' ref={null}>
                                    <Button
                                        onClick={handleUpdateRole}
                                        style={{
                                            marginTop: '1em',
                                        }}
                                        loading={updatingRole}
                                        type='primary'
                                    >
                                        {updatingRole ? 'Updating' : 'Update Role'}
                                    </Button>
                                </Tooltip>
                                : null}

                        </Space>
                    </div>
                }
            >
                <Row gutter={[32, 32]}
                    style={{
                        justifyContent: 'center'
                    }}
                >
                    {pages.map((page) => (
                        <Col span={'auto'} key={page.id}>
                            <Card
                                hoverable
                                title={
                                    !isLoaded ? <Checkbox
                                        checked={selectedPages?.some((p) => p.page === page.page)}
                                        onChange={() => handlePageSelect(page)}
                                        style={{
                                            color: selectedPages?.some((p) => p.page === page.page)
                                                ? 'blue' : 'green'
                                        }}
                                    >
                                        {page.page}
                                    </Checkbox> : null
                                }
                            >
                                <Skeleton loading={isLoaded} active style={{ width: 280 }}>
                                    <div>
                                        <Typography
                                            style={{
                                                marginBottom: '0.5em'
                                            }}
                                        >
                                            Permissions:
                                        </Typography>
                                        <div
                                            style={{
                                                marginLeft: '0.5em'
                                            }}
                                        >
                                            {crudPermissions.map((permission) => (
                                                <Checkbox
                                                    key={`${page.id}-${permission.name}`}
                                                    checked={
                                                        selectedPages?.some(
                                                            (p) => p.page === page.page
                                                                && p.crudPermissions?.includes(permission.name)
                                                        )
                                                    }
                                                    onChange={() => handleCRUDSelect(page.page, permission.name)}
                                                    disabled={!selectedPages?.some((p) => p.page === page.page)}
                                                    style={{
                                                        color: permission.name === 'Delete' ? 'red' : '',
                                                        marginRight: '0.2em'
                                                    }}
                                                >
                                                    {permission.name}
                                                </Checkbox>
                                            ))}
                                        </div>

                                        <div
                                            style={{
                                                marginTop: '1em'
                                            }}
                                        >
                                            <Text
                                                delete
                                            >
                                                Additional:
                                            </Text>
                                        </div>
                                    </div>
                                </Skeleton>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card >
        </Spin >
    )
}

export default UpdateRole