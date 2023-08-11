import apiService from '@api/index'
import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
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
import { TaskData } from '../section/comp'
import { GrFormAdd } from 'react-icons/gr'

type AddNewTaskProps = {
    sectionId: string,
    setSectionTasks: (tasks: [TaskData]) => void
}

const initialState = {
    title: '',
    content: ''
}

const AddNewTask = ({ sectionId, setSectionTasks }: AddNewTaskProps) => {
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const [isAdding, setIsAdding] = useState<boolean>(false)

    const {
        isOpen: isOpenAddTask,
        onOpen: onOpenAddTask,
        onClose: onCloseAddTask
    } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [newTaskData, setNewTaskData] = useState(initialState)
    const { title, content } = newTaskData

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setNewTaskData({ ...newTaskData, [name]: String(value) })
    }

    const handleAddTask = async (e: any) => {
        e?.preventDefault()

        if (title === '' || title.trim() === '') {
            toast({
                description: `Please add a task title`,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (title?.length > 150) {
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
            title,
            content
        }

        try {
            const { data } = await apiService.POST(`/boards/tasks/${sectionId}`, body, token)

            const { message, newTasks } = data;

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            setSectionTasks(newTasks)
            setNewTaskData(initialState)
            setIsAdding(false)
            onCloseAddTask()
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
            <IconButton
                aria-label='add-task'
                icon={<GrFormAdd />}
                onClick={onOpenAddTask}
                mr={'0.5em'}
            />

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpenAddTask}
                onClose={onCloseAddTask}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={(e: any) => handleAddTask(e)}>
                        <ModalHeader>Add New Task</ModalHeader>
                        <ModalBody pb={6}>
                            <Skeleton isLoaded={!isAdding}>
                                <FormControl>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        ref={initialRef}
                                        placeholder='Task title'
                                        name='title'
                                        onChange={handleInputChange}
                                        value={title}
                                    />
                                </FormControl>

                                <FormControl mt={'1em'}>
                                    <FormLabel>Content</FormLabel>
                                    <Input
                                        placeholder='Task content'
                                        name='content'
                                        onChange={handleInputChange}
                                        value={content}
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

                            <Button onClick={onCloseAddTask}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddNewTask