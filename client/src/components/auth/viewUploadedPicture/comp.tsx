import {
    Box,
    Button,
    Center,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast
} from '@chakra-ui/react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchGetUser, fetchUserInfo } from '../../../features/actions/auth'
import endUrl from '@utils/endUrl'

type ViewNewProfileImageProps = {
    previewUrl: string,
    isOpenViewUploadedImage: boolean,
    onCloseViewUploadedImage: any,
    updatingPicture: boolean,
    isValidatingImage: boolean,
    setUpdatingPicture: any,
    uploadedFile: any
}

const ViewUploadedPicture = ({
    previewUrl,
    isOpenViewUploadedImage,
    onCloseViewUploadedImage,
    updatingPicture,
    isValidatingImage,
    setUpdatingPicture,
    uploadedFile
}: ViewNewProfileImageProps) => {
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const dispatch = useDispatch()

    const handleCloseViewProfileImage = () => {
        const fileInput: any = document.querySelector(`input[name="image"][type="file"]`);
        if (fileInput instanceof HTMLInputElement) {
            fileInput.value = '';
        }
        onCloseViewUploadedImage()
    }

    const handleUpdatePicture = async (event: any) => {
        event.preventDefault();

        if (!uploadedFile) {
            // file size exceeded the limit
            toast({
                description: 'Please upload a picture first',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        const formData = new FormData();

        if (uploadedFile) {
            formData.append('image', uploadedFile);
        }

        if (uploadedFile && uploadedFile.size > 5 * 1024 * 1024) {
            // file size exceeded the limit
            toast({
                description: 'File size limit exceeded (max 5 MB)',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (uploadedFile &&
            uploadedFile.type !== 'image/jpeg' &&
            uploadedFile.type !== 'image/jpg' &&
            uploadedFile.type !== 'image/webp'
        ) {
            toast({
                description: 'Only .webp, .jpeg and .jpg files are allowed!',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        try {
            setUpdatingPicture(true)
            const { data } = await axios.put(`${endUrl}/user/profile/picture`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const message = await data?.message;

            toast({
                description: message,
                status: message?.startsWith('Only') || message?.startsWith('File size')
                    ? 'error' : 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })

            // event.target.value = ''

            const fileInput: any = document.querySelector(`input[name="image"][type="file"]`);
            if (fileInput instanceof HTMLInputElement) {
                fileInput.value = '';
            }
            setUpdatingPicture(false)

            const res = await fetchUserInfo(token)
            dispatch(dispatchGetUser(res))
        } catch (error: any) {
            setUpdatingPicture(false)
            toast({
                description: await error?.response?.data?.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
        }
    }

    return (
        <>
            <Modal 
            isOpen={isOpenViewUploadedImage} 
            onClose={handleCloseViewProfileImage} 
            isCentered
            closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View Uploaded Image</ModalHeader>
                    <ModalBody>
                        <Center>
                            <Box
                                borderColor={'brand.300'}
                                borderWidth={'1px'}
                                borderRadius={5}
                                p={2}
                            >
                                <Image
                                    src={previewUrl}
                                    alt='uploaded-image'
                                />
                            </Box>
                        </Center>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}
                            onClick={handleCloseViewProfileImage}
                            mr={3}
                        >
                            Cancel
                        </Button>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'blue.500',
                            }}
                            onClick={handleUpdatePicture}
                            isDisabled={isValidatingImage || updatingPicture}
                        >
                            {updatingPicture ? 'Updating...' : 'Update'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ViewUploadedPicture