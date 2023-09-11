import { SecurityScanOutlined } from '@ant-design/icons';
import apiService from '@api/index';
import { TokenState } from '@features/reducers/token';
import { crudPermissions, pages } from '@utils/pages';
import { checkLength, checkWhiteSpaces } from '@utils/stringCheck';
import { App, Button, Card, Checkbox, Col, Input, Row, Skeleton, Space, Spin, Tooltip, Typography } from 'antd'
import { useState, useEffect } from 'react'
import { MdKeyboardReturn } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

const { Text } = Typography;

interface SelectedPage {
    id: number;
    page: string;
    crudPermissions: string[];
}

type Page = {
    id: number,
    page: string
}

const initialState = {
    roleName: ''
}

const AddNewRole = () => {
    const token = useSelector((state: TokenState) => state.token)
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true)

    const { message: messageApi } = App.useApp()

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
                return [...prevSelected, { id: page.id, page: page.page, crudPermissions: ['Read'] }]
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
        const nameWhiteSpaceCheck = checkWhiteSpaces(roleName)
        const nameLength = checkLength(roleName, 2)
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

        const access = selectedPages.map((page) => ({
            page: page.page,
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

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            setRoleInfo(initialState)
            setSelectedPages([])
            setAddingNewRole(false)
            navigate('/roles')
        } catch (error: any) {
            setAddingNewRole(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <Spin spinning={addingNewRole}>
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
                                value={roleName}
                                type="text"
                                name="roleName"
                                prefix={<SecurityScanOutlined />}
                                placeholder="role name"
                                style={{
                                    marginTop: '1em',
                                    width: 'auto'
                                }}
                            />

                            <Tooltip title='Save Role' ref={null}>
                                <Button
                                    onClick={handleSaveRole}
                                    style={{
                                        marginTop: '1em',
                                    }}
                                    loading={addingNewRole}
                                    type='primary'
                                >
                                    {addingNewRole ? 'Saving' : 'Save Role'}
                                </Button>
                            </Tooltip>
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
                                    <Checkbox
                                        checked={selectedPages.some((p) => p.id === page.id)}
                                        onChange={() => handlePageSelect(page)}
                                        style={{
                                            color: selectedPages.some((p) => p.id === page.id) ? 'blue' : 'green'
                                        }}
                                    >
                                        {page.page}
                                    </Checkbox>
                                }
                            >
                                <Skeleton loading={loading} active style={{ width: 280 }}>
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
                                                        selectedPages.some(
                                                            (p) => p.id === page.id
                                                                && p.crudPermissions?.includes(permission.name)
                                                        )
                                                    }
                                                    onChange={() => handleCRUDSelect(page.id, permission.name)}
                                                    disabled={!selectedPages.some((p) => p.id === page.id)}
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
            </Card>
        </Spin>
    )
}

export default AddNewRole