import { InboxOutlined, PictureOutlined } from '@ant-design/icons'
import { dispatchGetAllUsers } from '@features/actions/users'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import endUrl from '@utils/endUrl'
import { User } from '@utils/types'
import { App, Modal, Spin, Tooltip, message as messageApiUp, Upload } from 'antd'
import { RcFile, UploadProps } from 'antd/es/upload'
import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const { Dragger } = Upload

type UpdateUserPicProps = {
    userId: string,
    usersList: User[]
}

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

const UpdateUserPic = ({ userId, usersList }: UpdateUserPicProps) => {
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

    // check
    const isCurrentUser = userId === currentUser?._id
    const tooltipTitle = isCurrentUser ? 'Disabled' : 'Update Profile Picture'

    // state
    const [uploadedFile, setUploadedFile] = useState<any>()
    const [uploading, setUploading] = useState(false)

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

    const handleUpload = async () => {
        const formData = new FormData();

        if (!uploadedFile) {
            messageApi.open({
                type: 'error',
                content: 'Please select a picture first'
            })
            return
        }

        if (uploadedFile.size > 2 * 1024 * 1024) {
            // file size exceeded the limit
            messageApi.open({
                type: 'error',
                content: 'File size limit exceeded (max 2 MB)'
            })
            return
        }

        if (uploadedFile &&
            uploadedFile.type !== 'image/jpeg' &&
            uploadedFile.type !== 'image/jpg' &&
            uploadedFile.type !== 'image/webp' &&
            uploadedFile.type !== 'image/png'
        ) {
            messageApi.open({
                type: 'error',
                content: 'Only .webp, .jpeg and .jpg files are allowed!'
            })
            return
        }

        formData.append('image', uploadedFile);

        try {
            setUploading(true)
            const { data } = await axios.put(`${endUrl}/user/picture/${userId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const { message, picPath } = data

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            const updatedList = usersList?.map((user: User) => {
                if (user?._id === userId) {
                    return { ...user, picture: picPath }
                }
                return user
            })

            dispatch(dispatchGetAllUsers(updatedList))

            // socket events
            socketProvider.emit('updateUserInfo_to_server', { userId: userId })
            socketProvider.emit('getUsersList_to_server', { userId: currentUser?._id })

            setUploading(false)
            setUploadedFile(null)
            setIsModalOpen(false)
        } catch (error: any) {
            setUploading(false)
            await messageApi.open({
                type: 'error',
                content: error?.response?.data?.message
            })
        }
    }

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        if (isCurrentUser) {
            return
        }
        setIsModalOpen(true)
    }
    const handleOk = () => {
        handleUpload()
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        setUploadedFile(null)
        setUploading(false)
    }

    return (
        <>
            <Tooltip title={tooltipTitle}>
                <PictureOutlined
                    disabled={isCurrentUser}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Update User Profile Picture"
                open={isModalOpen}
                onOk={handleOk}
                okText='Update'
                onCancel={handleCancel}
                confirmLoading={uploading}
                centered
            >
                <Spin spinning={uploading}>
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
                        style={{
                            marginBottom: '1em',
                            marginTop: '1em'
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single upload only.
                        </p>
                    </Dragger>
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

export default UpdateUserPic