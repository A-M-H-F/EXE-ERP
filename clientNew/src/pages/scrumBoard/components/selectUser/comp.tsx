import useUsersProfilePictures from '@utils/images/useUsersProfilePictures'
import { User } from '@utils/types'
import { Avatar, Space } from 'antd'

type SelectUserProps = {
    user: User
}

const SelectUser = ({ user }: SelectUserProps) => {
    return (
        <Space>
            <Avatar
                src={useUsersProfilePictures(user?.picture)}
            />
            {user?.name}
        </Space>
    )
}

export default SelectUser