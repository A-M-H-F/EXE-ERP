import { FileImageOutlined, LogoutOutlined, SecurityScanOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { AuthState } from '@features/reducers/auth'
import useProfilePicture from '@utils/images/useProfilePicture'
import { Avatar, Dropdown, Image, message as messageApi } from 'antd'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { TokenState } from '@features/reducers/token'
import { useDispatch } from 'react-redux'
import apiService from '@api/index'
import { dispatchLogout } from '@features/actions/auth'
import { useState } from 'react'

const ProfileMenu = () => {
    const { user, role } = useSelector((state: AuthState) => state.auth)
    const currentPath = useLocation()
    const pathName = currentPath.pathname
    const token = useSelector((state: TokenState) => state.token)
    const dispatch = useDispatch()
    const [visibleProfilePic, setVisibleProfilePic] = useState(false)

    const handleLogout = async () => {
        await messageApi.open({
            type: 'loading',
            content: 'Logout in progress..',
            duration: 0.4
        })

        try {
            const { data } = await apiService.GET('/auth/logout', token)

            const { message } = data

            await messageApi.open({
                type: 'success',
                content: message,
                duration: 1,
            })

            dispatch(dispatchLogout())
            localStorage.removeItem('extreme')
            window.location.href = '/'
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message,
            });
        }
    }

    const items: MenuProps['items'] = [
        {
            label: user?.name,
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: `Role: ${role?.name}`,
            key: '2',
            icon: <SecurityScanOutlined />,
            style: { color: 'green' }
        },
        {
            label: `View Profile Pic`,
            key: '3',
            icon: <FileImageOutlined />,
            onClick: () => setVisibleProfilePic(true),
            style: { color: 'blue' }
        },
        {
            key: '4',
            type: 'divider'
        },
        {
            label: pathName === '/profile'
                ?
                'Account Settings'
                :
                <Link to={'/profile'}>
                    Account Settings
                </Link>,

            key: '5',
            icon: <SettingOutlined />,
        },
        {
            label: 'Logout',
            key: '6',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },
    ];

    const menuProps = {
        items
    };

    return (
        <>
            <div
                style={{
                    display: 'flex'
                }}
            >
                <Dropdown
                    menu={menuProps} trigger={['click', 'hover']}
                >
                    <Avatar
                        size={{ xs: 32, sm: 34, md: 40, lg: 40, xl: 50, xxl: 50 }}
                        // src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
                        icon={user?.picture === '' ?
                            <UserOutlined alt="profile-photo" style={{ backgroundColor: '#87d068' }} />
                            : undefined}
                        src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
                    />
                </Dropdown>

                <Image
                    style={{ display: 'none' }}
                    src={user?.picture === '' ? '' : useProfilePicture(user?.picture)}
                    preview={{
                        visible: visibleProfilePic,
                        scaleStep: 0.5,
                        src: user?.picture === '' ? '' : useProfilePicture(user?.picture),
                        onVisibleChange: (value) => {
                            setVisibleProfilePic(value);
                        },
                    }}
                />
            </div>
        </>
    )
}

export default ProfileMenu