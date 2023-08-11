import { dispatchGetUsersSelection, fetchUsersSelection } from '@features/actions/usersSelection'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { BoardInfoData } from '../boardInfo/comp'
import { FormControl, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react'
import { User } from '@utils/types'
import { SelectNewUser } from '../selectNewUser'
import { isBoardCreator, isUserExistsInBoard } from '@pages/scrumBoard/utils/user'
import apiService from '@api/index'
import { AiOutlineUserAdd } from 'react-icons/ai'

type AddUserToBoardProps = {
  boardInfo: BoardInfoData | any,
  setBoardInfo: (boardInfo: BoardInfoData) => void
}

const AddUserToBoard = ({ boardInfo, setBoardInfo }: AddUserToBoardProps) => {
  const token = useSelector((state: any) => state.token)
  const { user: currentUser } = useSelector((state: any) => state.auth)
  const usersSelection = useSelector((state: any) => state.usersSelection)
  const dispatch = useDispatch()
  const toast = useToast()

  useEffect(() => {
    if (token) {
      fetchUsersSelection(token).then((res: any) => {
        dispatch(dispatchGetUsersSelection(res))
      })
    }
  }, [token])

  const handleAddNewUserToBoard = async (userId: string) => {
    const body = {
      user: userId
    }

    try {
      const { data } = await apiService.PUT(`/boards/user/add/${boardInfo?._id}`, body, token)

      const { message, newBoardInfo } = data;

      setBoardInfo(newBoardInfo)
      toast({
        description: message,
        status: 'success',
        duration: 2000,
        position: 'top-right',
        isClosable: true
      })
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
    <FormControl>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          variant='ghost'
          colorScheme='blue'
          aria-label='favorite-nan'
          fontSize='2.1em'
          p={'2'}
          icon={<AiOutlineUserAdd />}
        />

        <MenuList minWidth='220px' maxHeight='200px' overflowY='auto'>
          {usersSelection?.map((user: User) => (
            <MenuItem
              key={user?._id}
              onClick={() => handleAddNewUserToBoard(user?._id)}
              isDisabled={
                isUserExistsInBoard(user?._id, boardInfo)
                || !isBoardCreator(boardInfo?.creator, currentUser?._id)
              }
            >
              <SelectNewUser
                user={user}
                currentUser={currentUser}
                boardInfo={boardInfo}
              />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </FormControl>
  )
}

export default AddUserToBoard