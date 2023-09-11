import { UserOutlined } from '@ant-design/icons'
import useUsersProfilePictures from '@utils/images/useUsersProfilePictures'
import { Avatar, Image, Space } from 'antd'

type UserNamePicRowProps = {
  name: string,
  pic: string,
}

const UserNamePicRow = ({ name, pic }: UserNamePicRowProps) => {
  return (
    <Space>
      <Avatar
        icon={<UserOutlined />}
        src={<Image src={useUsersProfilePictures(pic)} alt={`${name}-profile-pic`} />}
      />
      <a>{name}</a>
    </Space>
  )
}

export default UserNamePicRow