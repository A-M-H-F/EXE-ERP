import apiService from '@api/index'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import { BoardSectionData } from '../boardInfo/comp'

type AddNewSectionProps = {
    boardId: string,
    setBoardSections: (section: [BoardSectionData]) => void
}

const initialState = {
    title: ''
}

const AddNewSection = ({ boardId, setBoardSections }: AddNewSectionProps) => {
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const [isAdding, setIsAdding] = useState<boolean>(false)

    const {
        isOpen: isOpenAddSection,
        onOpen: onOpenAddSection,
        onClose: onCloseAddSection
    } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [sectionTitle, setSectionTitle] = useState(initialState)
    const { title } = sectionTitle

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setSectionTitle({ ...sectionTitle, [name]: String(value) })
    }

    const handleAddSection = async (e: any) => {
        e?.preventDefault()

        if (title === '' || title.trim() === '') {
            toast({
                description: `Please add a section title`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (title?.length > 20) {
            toast({
                description: 'Please choose a short title.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        setIsAdding(true)

        const body = {
            title
        }

        try {
            const { data } = await apiService.POST(`/boards/sections/${boardId}`, body, token)

            const { message, newSections } = data;

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            setBoardSections(newSections)
            setSectionTitle(initialState)
            setIsAdding(false)
            onCloseAddSection()
        } catch (error: any) {
            setIsAdding(false)
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
            <Button
                onClick={onOpenAddSection}
                mt={'0.5em'}
                variant={'outline'}
            >
                Add new section
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpenAddSection}
                onClose={onCloseAddSection}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={(e: any) => handleAddSection(e)}>
                        <ModalHeader>Add New Section</ModalHeader>
                        <ModalBody pb={6}>
                            <Skeleton isLoaded={!isAdding}>
                                <FormControl>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        ref={initialRef}
                                        placeholder='Section title'
                                        name='title'
                                        onChange={handleInputChange}
                                        value={title}
                                    />
                                </FormControl>
                            </Skeleton>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                type='submit'
                                colorScheme='blue'
                                mr={3}
                                isDisabled={isAdding}
                            >
                                {isAdding ? 'Adding...' : 'Add'}
                            </Button>

                            <Button onClick={onCloseAddSection}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddNewSection