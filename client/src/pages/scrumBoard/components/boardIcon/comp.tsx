import apiService from '@api/index'
import { useEffect, useState } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { Button, Icon, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { generateResponseBody } from '@api/helpers'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { useDispatch } from 'react-redux'
import { icons } from '@pages/scrumBoard/utils/icons'

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const BoardIcon = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const initialState = {
        icon: boardInfo?.icon
    }

    const token = useSelector((state: any) => state.token)
    const toast = useToast()
    const dispatch = useDispatch()

    const [isUpdating, setIsUpdating] = useState(false)

    const [newIcon, setNewIcon] = useState(initialState)
    const { icon } = newIcon

    useEffect(() => {
        setNewIcon(initialState)
    }, [boardInfo])

    const handleUpdateTitle = async (e: any, iconT: string) => {
        e?.preventDefault()

        if (iconT === boardInfo?.icon) {
            toast({
                description: 'Please choose a unique icon.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        if (iconT?.trim() === '' || icon === ' ') {
            toast({
                description: 'Icon should not contain only whitespace.',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })
            return
        }

        const body = {
            icon: iconT
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/boards/icon/${boardInfo?._id}`, body, token)

            const { message, newBoardInfo, standardBoards, favoriteBoards } = data;

            setBoardInfo(newBoardInfo)
            toast({
                description: message,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))

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
        <Menu closeOnSelect={true}>
            <MenuButton mr={'0.5em'} isDisabled={isUpdating} as={Button}>
                <Icon
                    as={icons[icon]}
                    boxSize={6}
                    bg={'none'}
                />
            </MenuButton>

            <MenuList maxHeight='200px' overflowY='auto' >
                {Object.keys(icons)?.map((iconT: any, index: number) => (
                    <MenuItem
                        key={index}
                        onClick={(e: any) => handleUpdateTitle(e, iconT)}
                        _hover={{
                            cursor: 'pointer'
                        }}
                        isDisabled={icon === iconT} 
                    >
                        <Icon
                            as={icons[iconT]}
                            boxSize={6}
                            color={icon === iconT ? 'blue' : 'red'}
                            _hover={{
                                color: 'blue'
                            }}
                            bg={'none'}
                        />
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    )
}

export default BoardIcon