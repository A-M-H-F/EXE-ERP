import React, { useState } from 'react'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    IconButton,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import apiService from '@api/index'
import { AiOutlineDelete } from 'react-icons/ai'

type DeleteSectionProps = {
    sectionInfo: BoardSectionData | any,
    boardInfo: BoardInfoData,
    setBoardSections: (sections: [BoardSectionData]) => void
}

const DeleteSection = ({ sectionInfo, boardInfo, setBoardSections }: DeleteSectionProps) => {
    const toast = useToast()
    const token = useSelector((state: any) => state.token)
    const { user: currentUser } = useSelector((state: any) => state.auth)
    const isCreator = isBoardCreator(boardInfo?.creator, currentUser?._id)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<any>()

    const [isDeleting, setIsDeleting] = useState<boolean>(false)


    const handleDeleteSection = async () => {
        if (!isCreator) return;

        setIsDeleting(true)
        try {
            const { data } = await apiService.DELETE(`/boards/sections/${sectionInfo?._id}`, token)

            const { message, newSections } = data;

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            setBoardSections(newSections)

        } catch (error: any) {
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
            {isCreator &&
                <IconButton
                    icon={<AiOutlineDelete />}
                    aria-label='delete-sectionInfo'
                    color='red'
                    onClick={onOpen}
                    fontSize={'20px'}
                    ml={2}
                />
            }
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Section
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                isDisabled={isDeleting}
                                colorScheme='red'
                                onClick={handleDeleteSection}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteSection