import { ProfileMenu } from "@components/auth/profileMenu"
import { SiderBarSection } from "@layout/sideBar"

import { Layout, theme } from "antd"

const { Header } = Layout

const HeaderSection = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
                background: colorBgContainer
            }}
        >
            <SiderBarSection />
            <ProfileMenu />
        </Header>
    )
}

export default HeaderSection