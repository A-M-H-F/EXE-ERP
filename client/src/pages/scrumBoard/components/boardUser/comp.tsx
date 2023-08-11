import { Avatar, Tag, TagCloseButton, TagLabel, useToast } from '@chakra-ui/react'
import useUsersProfilePictures from '@utils/images/useUsersProfilePictures'
import { BoardInfoData, BoardUserInfo } from '../boardInfo/comp'
import apiService from '@api/index'
import { useSelector } from 'react-redux'
import { isBoardCreator, isBoardCurrentUser } from '@pages/scrumBoard/utils/user'

type BoardUserProps = {
  user: BoardUserInfo,
  boardInfo: BoardInfoData,
  setBoardInfo: (data: BoardInfoData) => void
}

const BoardUser = ({ user, boardInfo, setBoardInfo }: BoardUserProps) => {
  const token = useSelector((state: any) => state.token)
  const { user: currentUser } = useSelector((state: any) => state.auth)
  const toast = useToast()

  const handleRemoveUserFromBoard = async () => {
    const body = {
      user: user?.user?._id
    }

    try {
      const { data } = await apiService.PUT(`/boards/user/remove/${boardInfo?._id}`, body, token)

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
    <Tag size='lg' colorScheme='red' borderRadius='full' >
      <Avatar
        src={useUsersProfilePictures(user.user.picture)}
        size='xs'
        name={user.user.name}
        ml={-1}
        mr={2}
      />
      <TagLabel>
        {isBoardCurrentUser(user.user._id, currentUser?._id) ? 'You' : user.user.name}
      </TagLabel>
      {isBoardCurrentUser(user.user._id, currentUser?._id)
        || !isBoardCreator(boardInfo?.creator, currentUser?._id) ?
        null :
        <TagCloseButton onClick={handleRemoveUserFromBoard} />
      }
    </Tag>
  )
}

export default BoardUser