import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { Box, Flex, Icon, IconButton, Spacer, Text, useToast } from '@chakra-ui/react'
import {
    dispatchGetBoards,
    dispatchGetFavoriteBoards
} from '@features/actions/scrumBoards'
import { icons } from '@pages/scrumBoard/utils/icons'
import { useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

export type BoardLinkProps = {
    title: string,
    _id: string,
    icon: any,
    favorite: boolean
}

const BoardLink = ({ title, _id, icon, favorite }: BoardLinkProps) => {
    const { boardId } = useParams()
    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const dispatch = useDispatch()

    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    const [isFavorite, setIsFavorite] = useState(false);

    const handleMouseEnter = () => {
        setIsFavorite(true);
    }

    const handleMouseLeave = () => {
        setIsFavorite(false);
    }

    const handleUpdateBoardFavoriteStatus = async () => {
        try {
            setIsUpdating(true)

            const body = {
                status: !favorite
            }

            const { data } = await apiService.PUT(`/boards/status/${_id}`, body, token)

            const { message, standardBoards, favoriteBoards } = data

            toast({
                description: message,
                status: 'success',
                duration: 1000,
                position: 'top-right',
                isClosable: true
            })
            
            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))

            setIsUpdating(false)
        } catch (error: any) {
            console.log(error)
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

    if (boardId === _id) {
        return (
            <Flex>
                <Box
                    borderRadius={10}
                    mb={'0.6em'}
                    p={2}
                    bgColor="#012169"
                    opacity={1}
                    cursor="default"
                    w={'100%'}
                >
                    <Flex color="#F2F4FA">
                        <Icon
                            as={icons[icon]}
                            boxSize={5}
                            mr={'0.2em'}
                        />
                        <Text fontWeight="medium" ml="1em">
                            {title}
                        </Text>
                    </Flex>
                </Box>

                <Spacer />

                <IconButton
                    variant='ghost'
                    colorScheme='red'
                    aria-label='favorite-nan'
                    fontSize='2em'
                    icon={favorite || isFavorite ? <AiFillStar /> : <AiOutlineStar />}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    _hover={{
                        bg: 'none'
                    }}
                    isDisabled={isUpdating}
                    onClick={handleUpdateBoardFavoriteStatus}
                />
            </Flex>
        )
    }

    return (
        <Flex>
            <Box
                border={'none'}
                borderRadius={10}
                mb={'0.6em'}
                bgColor={''}
                // 002fa7
                p={2}
                opacity={0.9} // 1 - 0.9 - 0.8
                _hover={{
                    bgColor: '#002fa7',
                    opacity: 1,
                    color: '#F2F4FA',
                }}
                w={'100%'}
                as={Link}
                key={_id} to={`/boards/${_id}`}
            >
                <Flex>
                    <Icon
                        as={icons[icon]}
                        boxSize={5}
                        mr={'0.2em'}
                    />
                    <Text fontWeight={'medium'} ml={'1em'}>
                        {title}
                    </Text>
                </Flex>
            </Box>

            <Spacer />

            <IconButton
                variant='ghost'
                colorScheme='red'
                aria-label='favorite-nan'
                fontSize='2em'
                icon={favorite || isFavorite ? <AiFillStar /> : <AiOutlineStar />}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                _hover={{
                    bg: 'none'
                }}
                isDisabled={isUpdating}
                onClick={handleUpdateBoardFavoriteStatus}
            />
        </Flex>
    )
}

export default BoardLink