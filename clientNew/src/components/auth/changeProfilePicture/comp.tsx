import { AuthState } from '@features/reducers/auth'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Image, message as messageApi, Modal, Row, Space, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload/interface'
import { TokenState } from '@features/reducers/token'
import useProfilePicture from '@utils/images/useProfilePicture'
import { dispatchGetUser, fetchUserInfo } from '@features/actions/auth'
import { useDispatch } from 'react-redux'
import endUrl from '@utils/endUrl'
import axios from 'axios'
import { useSocket } from '@socket/provider/socketProvider'

const beforeUpload = (file: RcFile) => {
    const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png'
        || file.type === 'image/webp' || file.type === 'image/jpg'
    if (!isJpgOrPngOrWebp) {
        messageApi.open({
            type: 'error',
            content: 'You can only upload JPG/PNG/WEBP file!'
        })
    }
    const isLt2M = file.size < 2 * 1024 * 1024
    if (!isLt2M) {
        messageApi.open({
            type: 'error',
            content: 'Image must smaller than 2MB!'
        })
    }
    return isJpgOrPngOrWebp && isLt2M
}

const ChangeProfilePicture = () => {
    const { user } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const dispatch = useDispatch()
    const { socketProvider } = useSocket()

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
    const handleCancel = () => setPreviewOpen(false);

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
            const { data } = await axios.put(`${endUrl}/user/profile/picture`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const { message } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })

            socketProvider.emit('getUsersList_to_server', { userId: user?._id })

            setUploading(false)
            setUploadedFile(null)
            const res = await fetchUserInfo(token)
            dispatch(dispatchGetUser(res))
        } catch (error: any) {
            setUploading(false)
            await messageApi.open({
                type: 'error',
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Row gutter={10}>
                <Col>
                    <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        src={<Image src={useProfilePicture(user?.picture)} alt='profile-pic' />}
                    />
                </Col>
                <Col>
                    <Space direction='vertical' size={16}>
                        <Upload
                            name="image"
                            listType="picture"
                            className="upload-list-inline"
                            showUploadList={uploadedFile ? true : false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            customRequest={(file: any) => dummyRequest(file)}
                            maxCount={1}
                            onPreview={handlePreview}
                            onRemove={() => setUploadedFile(null)}
                        >
                            <Button icon={<UploadOutlined />}>Select Picture</Button>
                        </Upload>

                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={!uploadedFile}
                            loading={uploading}
                            style={{ marginRight: 16 }}
                        >
                            {uploading ? 'Saving' : 'Save'}
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="profile-pic-preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default ChangeProfilePicture