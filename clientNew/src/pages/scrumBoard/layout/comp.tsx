
import { Button, Layout, Skeleton, theme } from 'antd';
import { ScrumBoardSideBar } from '../components/sidebar';
import { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ScrumBoard } from '../components/board';

const { Header, Sider, Content } = Layout

const ScrumBoardLayout = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    const [isOpen, setIsOpen] = useState<boolean>(true)

    const [loading, setLoading] = useState<boolean>(true)

    const handleSideBar = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 800)
    }, [])

    return (
        <Skeleton active paragraph={{ rows: 20 }} loading={loading}>
            <Layout>
                {isOpen &&
                    <Sider
                        style={{
                            backgroundColor: 'blue',
                            minHeight: '800px',
                            borderRadius: 5,
                            borderWidth: '1px',
                            borderColor: 'black'
                        }}
                    >
                        <ScrumBoardSideBar />
                    </Sider>
                }
                <Layout>
                    <Header
                        style={{
                            height: 54,
                            paddingInline: 10,
                            lineHeight: '64px',
                            background: colorBgContainer
                        }}
                    >
                        <Button
                            type="text"
                            icon={!isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={handleSideBar}
                            style={{
                                fontSize: '16px',
                                height: 50,
                                width: 50
                            }}
                        />
                    </Header>
                    <Content
                        style={{
                            minHeight: 120,
                            backgroundColor: colorBgContainer,
                        }}
                    >
                        <ScrumBoard />
                    </Content>
                </Layout>
            </Layout>
        </Skeleton>
    )
}

export default ScrumBoardLayout