import { CheckIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import { isBoardCurrentUser } from '@pages/scrumBoard/utils/user';
import useUsersProfilePictures from '@utils/images/useUsersProfilePictures';
import { User } from '@utils/types';

type SelectUserProps = {
    user: User,
    selectedUsers: any,
    currentUser: User
}

const SelectUser = ({ user, selectedUsers, currentUser }: SelectUserProps) => {
    const isSelected = selectedUsers.some((u: any) => u.user === user._id)

    return (
        <Flex alignItems={'center'}>
            {isSelected || isBoardCurrentUser(user?._id, currentUser?._id) ? <CheckIcon mr={'14px'} />
                :
                <Box mr={'1.9em'} />
            }
            <Avatar
                boxSize='2rem'
                borderRadius='full'
                src={useUsersProfilePictures(user?.picture)}
                mr='12px'
            />
            <Text>
                {currentUser?._id === user?._id ? 'You' : user?.name}
            </Text>
        </Flex>
    )
}

export default SelectUser