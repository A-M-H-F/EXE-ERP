import {
    CloseOutlined,
    InboxOutlined,
    LoginOutlined,
    PlusOutlined,
    SecurityScanOutlined,
    UserOutlined
} from '@ant-design/icons'
import apiService from '@api/index'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import {
    App,
    Button,
    Modal,
    Space,
    Spin,
    message as messageApiUp,
    Upload,
    Form,
    Input,
    Divider,
    Select
} from 'antd'
import { RcFile } from 'antd/es/upload'
import { UploadProps } from 'antd/lib'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import defaultProfilePicture from '@assets/images/defaultProfilePic/pic.png'
import { dispatchGetAllUsers, fetchAllUsers } from '@features/actions/users'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { RoleListState } from '@features/reducers/roles'
import { dispatchGetRoles, fetchRoles } from '@features/actions/roles'
import { AuthState } from '@features/reducers/auth'
import { UsersListState } from '@features/reducers/users'
import { checkLength, checkWhiteSpaces } from '@utils/stringCheck'

const { Dragger } = Upload

type InitialStateProps = {
    name: string,
    username: string,
    role: string,
    password: string,
    confirmPassword: string
}

const initialState: InitialStateProps = {
    name: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: '',
}

function PasswordRequirement({ label, meets }: { meets: boolean; label: string }) {
    return (
        <div>
            {meets ?
                null
                :
                <Space>
                    <CloseOutlined style={{ color: 'red' }} />
                    {label}
                </Space >}
        </div>
    )
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
    { re: /.{6,}/, label: 'At least 6 characters' }
]

const beforeUpload = (file: RcFile) => {
    const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png'
        || file.type === 'image/webp' || file.type === 'image/jpg'
    if (!isJpgOrPngOrWebp) {
        messageApiUp.open({
            type: 'error',
            content: 'You can only upload JPG/PNG/WEBP file!'
        })
    }
    const isLt2M = file.size < 2 * 1024 * 1024
    if (!isLt2M) {
        messageApiUp.open({
            type: 'error',
            content: 'Image must smaller than 2MB!'
        })
    }
    return isJpgOrPngOrWebp && isLt2M
}

const AddNewUser = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes
    const roles = useSelector((state: RoleListState) => state.roles)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const usersList = useSelector((state: UsersListState) => state.usersList)

    useEffect(() => {
        fetchRoles(token).then((res: any) => {
            dispatch(dispatchGetRoles(res))
        })

        fetchAllUsers(token).then((res: any) => {
            dispatch(dispatchGetAllUsers(res))
        })
    }, [])

    // loading
    const [adding, setAdding] = useState<boolean>(false)

    // state
    const [uploadedFile, setUploadedFile] = useState<any>()

    const [userInfo, setUserInfo] = useState<InitialStateProps>(initialState)
    const {
        name,
        username,
        role,
        password,
        confirmPassword
    } = userInfo

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setUserInfo({ ...userInfo, [name]: String(value) })
    }

    const handleRoleChange = (role: string) => {
        setUserInfo({ ...userInfo, ['role']: role })
    }

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
    ))

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        handleAddNewUser()
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        setUploadedFile(null)
        setUserInfo(initialState)
    }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok")
        }, 0)
    }

    const handleChange: UploadProps['onChange'] = (info: any) => {
        const isJpgOrPngOrWebp = info.file.type === 'image/jpeg' ||
            info.file.type === 'image/png'
            || info.file.type === 'image/webp'
        if (!isJpgOrPngOrWebp) {
            setUploadedFile(null)
        }

        if (info.file.status === 'done') {
            setUploadedFile(info.file.originFileObj)
        }
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancelPreview = () => setPreviewOpen(false);

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj)
        }

        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
    }

    const handleAddNewUser = async () => {
        const formData = new FormData();
        if (!uploadedFile) {
            const defaultPictureBlob = await fetch(defaultProfilePicture).then(response => response.blob());
            const defaultPictureFile = new File([defaultPictureBlob], 'default-profile-picture.png', { type: 'image/png' });

            formData.append('image', defaultPictureFile);
        } else {
            formData.append('image', uploadedFile);
        }

        // password checks
        let types = true;
        checks.map((check: any) => {
            if (!check?.props?.meets) {
                types = false
                messageApi.open({
                    type: 'error',
                    content: check?.props?.label
                })
                return
            }
        })
        if (!types) {
            messageApi.open({
                type: 'error',
                content: 'Please check password conditions'
            })
            return
        }
        if (confirmPassword !== password) {
            messageApi.open({
                type: 'error',
                content: 'Please confirm the new password'
            })
            return
        }

        // username - name
        const userNameWhiteSpaceCheck = checkWhiteSpaces(username)
        const userNameLength = checkLength(username, 3)
        if (userNameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Username should not contain only whitespace'
            })
            return
        }
        if (userNameLength) {
            messageApi.open({
                type: 'error',
                content: 'Username must be at least 4 characters long'
            })
            return
        }
        const isValidUsername = /^[a-z]+$/.test(username);
        if (!isValidUsername) {
            messageApi.open({
                type: 'error',
                content: 'Username can only contain lowercase letters (a-z).'
            })
            return
        }

        const nameWhiteSpaceCheck = checkWhiteSpaces(name)
        const nameLength = checkLength(name, 3)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Name should not contain only whitespace'
            })
            return
        }
        if (nameLength) {
            messageApi.open({
                type: 'error',
                content: 'Name must be at least 4 characters long'
            })
            return
        }

        // role
        if (!role || role === '') {
            messageApi.open({
                type: 'error',
                content: 'Please assign role to user'
            })
            return
        }

        const params = {
            name,
            username,
            role,
            password
        }

        try {
            setAdding(true)

            const { data } = await apiService.POSTWithParams(`/user/`, formData, params, token)

            const { message, newUser } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = [...usersList, newUser]

            dispatch(dispatchGetAllUsers(updatedList))

            socketProvider.emit('getUsersList_to_server', { userId: currentUser?._id })

            handleCancel()
            setAdding(false)
        } catch (error: any) {
            setAdding(false)
            messageApi.open({
                type: 'error',
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Button
                type='primary'
                style={{
                    marginBottom: '2em'
                }}
                icon={<PlusOutlined />}
                onClick={showModal}
            >
                Add New User
            </Button>

            <Modal
                title="Add new User"
                open={isModalOpen}
                onOk={handleOk}
                okText='Save'
                onCancel={handleCancel}
                confirmLoading={adding}
                centered={xs || sm || md ? false : true}
                maskClosable={false}
            >
                <Spin spinning={adding}>
                    <Form
                        layout='vertical'
                        style={{
                            marginTop: '1em'
                        }}
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label='Profile Picture'
                        >
                            <Dragger
                                name="image"
                                showUploadList={uploadedFile ? true : false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                customRequest={(file: any) => dummyRequest(file)}
                                maxCount={1}
                                onPreview={handlePreview}
                                onRemove={() => setUploadedFile(null)}
                                listType="picture"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single upload only.
                                </p>
                            </Dragger>
                        </Form.Item>

                        <Form.Item
                            label='Full Name'
                            required
                        >
                            <Input
                                name='name'
                                value={name}
                                onChange={handleInputChange}
                                prefix={<UserOutlined />}
                                placeholder='full name'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Username'
                            required
                        >
                            <Input
                                name='username'
                                value={username}
                                onChange={handleInputChange}
                                prefix={<LoginOutlined />}
                                placeholder='extreme'
                            />
                        </Form.Item>

                        <Form.Item label='Role' required>
                            <Select
                                optionLabelProp="label"
                                suffixIcon={<SecurityScanOutlined />}
                                onChange={handleRoleChange}
                                placeholder={'Select Role'}
                                value={role === '' ? 'Select Role' : role}
                            >
                                {roles?.map((role: any) => (
                                    <Select.Option
                                        value={role?._id}
                                        key={role?._id}
                                        label={role?.name}
                                        name={'role'}
                                    >
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Divider />

                        <Form.Item
                            label='Password'
                            required
                        >
                            <Input.Password
                                name='password'
                                value={password}
                                onChange={handleInputChange}
                                prefix={<RiLockPasswordLine />}
                                placeholder='******'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Confirm Password'
                            required
                        >
                            <Input.Password
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleInputChange}
                                prefix={<RiLockPasswordLine />}
                                placeholder='******'
                            />
                        </Form.Item>

                        {password !== '' && checks}
                        {confirmPassword !== password && confirmPassword !== '' ?
                            <PasswordRequirement label="Match Passwords" meets={confirmPassword == password} />
                            : null}
                    </Form>
                </Spin>

                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancelPreview}
                >
                    <img alt="profile-pic-preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Modal>
        </>
    )
}

export default AddNewUser