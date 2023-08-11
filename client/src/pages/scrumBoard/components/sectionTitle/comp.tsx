import apiService from '@api/index'
import { useEffect, useState } from 'react'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import { ButtonGroup, Flex, FormControl, IconButton, Input, useToast } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'

type SectionTitleProps = {
    sectionInfo: BoardSectionData | any,
    boardInfo: BoardInfoData
}

const SectionTitle = ({ sectionInfo, boardInfo }: SectionTitleProps) => {
    const initialState = {
        title: sectionInfo?.title
    }

    const { user: currentUser } = useSelector((state: any) => state.auth)
    const token = useSelector((state: any) => state.token)
    const toast = useToast()

    // editable
    const [isEditable, setIsEditable] = useState(false)

    const [isUpdating, setIsUpdating] = useState(false)

    const [newTitle, setNewTitle] = useState(initialState)
    const { title } = newTitle
    const handleChangeTitle = (e: any) => {
        const { name, value } = e.target

        setNewTitle({ ...newTitle, [name]: String(value) })
    }

    useEffect(() => {
        setNewTitle(initialState)
    }, [sectionInfo])

    const handleCancelEdit = (e: any) => {
        e?.preventDefault()

        setNewTitle(initialState)
        setIsEditable(false)
    }

    const handleUpdateTitle = async (e: any) => {
        e?.preventDefault()

        if (title === sectionInfo?.title) {
            toast({
                description: 'Please choose a unique title.',
                status: 'error',
                duration: 2000,
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

        if (title?.trim() === '' || title === ' ') {
            toast({
                description: 'Title should not contain only whitespace.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        const body = {
            title
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/boards/sections/title/${sectionInfo?._id}`, body, token)

            const { message } = data;

            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            setIsEditable(false)
            setIsUpdating(false)
        } catch (error: any) {
            setIsUpdating(false)
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
            <FormControl id="sectionTitle">
                {/* <FormLabel>Board Title</FormLabel> */}
                <Flex alignItems={'center'}>
                    <Input
                        placeholder="Title"
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        name='title'
                        onChange={handleChangeTitle}
                        value={title || ''}
                        readOnly={!isEditable}
                        borderColor={isEditable ? 'brand.300' : 'inherit'}
                        _hover={{
                            borderColor: isEditable ? 'brand.300' : ''
                        }}
                    />

                    {!isEditable && isBoardCreator(boardInfo?.creator, currentUser?._id) ?
                        <IconButton
                            ml={'0.5em'}
                            colorScheme='green'
                            size='sm'
                            icon={<EditIcon />}
                            aria-label='editSectionTitle'
                            onClick={() => setIsEditable(true)}
                        />
                        : null
                    }

                    {isEditable &&
                        <ButtonGroup
                            justifyContent='center'
                            size='sm'
                            ml={'1em'}
                        >
                            <IconButton
                                icon={<CheckIcon />}
                                aria-label='CheckIcon'
                                colorScheme='green'
                                onClick={handleUpdateTitle}
                                isDisabled={isUpdating}
                            />

                            <IconButton
                                icon={<CloseIcon />}
                                aria-label='CloseIcon'
                                colorScheme='red'
                                onClick={handleCancelEdit}
                            />
                        </ButtonGroup>
                    }
                </Flex>
            </FormControl>
        </>
    )
}

export default SectionTitle