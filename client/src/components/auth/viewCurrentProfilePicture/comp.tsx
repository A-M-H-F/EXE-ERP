import {
    Box,
    Center,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react'
import useProfilePicture from '@utils/images/useProfilePicture'

type ViewCurrentProfilePictureProps = {
    user: any,
    isOpenViewCurrentImage: boolean,
    onCloseViewCurrentImage: any
}

const ViewCurrentProfilePicture = ({
    user,
    isOpenViewCurrentImage,
    onCloseViewCurrentImage }: ViewCurrentProfilePictureProps) => {

    return (
        <>
            <Modal isOpen={isOpenViewCurrentImage} onClose={onCloseViewCurrentImage} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Profile Picture</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <Box
                                borderColor={'brand.300'}
                                borderWidth={'1px'}
                                borderRadius={5}
                                p={2}
                            >
                                <Image
                                    src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
                                    alt='current-profile-picture'
                                />
                            </Box>
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ViewCurrentProfilePicture