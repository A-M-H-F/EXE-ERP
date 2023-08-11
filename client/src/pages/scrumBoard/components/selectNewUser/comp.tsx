import { User } from '@utils/types'
import { BoardInfoData } from '../boardInfo/comp'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { isBoardCurrentUser, isUserExistsInBoard } from '@pages/scrumBoard/utils/user'
import { CheckIcon } from '@chakra-ui/icons'
import useUsersProfilePictures from '@utils/images/useUsersProfilePictures'

type SelectNewUserProps = {
    user: User,
    currentUser: User,
    boardInfo: BoardInfoData
}

const SelectNewUser = ({ user, currentUser, boardInfo }: SelectNewUserProps) => {
    const isSelected = isUserExistsInBoard(user?._id, boardInfo)

    return (
        <Flex alignItems={'center'}>
            {isSelected || isBoardCurrentUser(user?._id, currentUser?._id) ? <CheckIcon mr={'14px'} />
                :
                <Box mr={'1.9em'} />
            }
            <Image
                boxSize='2rem'
                borderRadius='full'
                src={useUsersProfilePictures(user?.picture)}
                alt={`user-${user?.name}`}
                mr='12px'
            />
            <Text>
                {currentUser?._id === user?._id ? 'You' : user?.name}
            </Text>
        </Flex>
    )
}

export default SelectNewUser