import { useLocation } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Button, Drawer, Menu, Typography } from 'antd'
import {
    MdHomeRepairService,
    MdOutlineInventory2,
    MdOutlineProductionQuantityLimits,
    MdOutlineUnsubscribe,
    MdWebAsset
} from 'react-icons/md'
import { IoNotificationsOutline } from 'react-icons/io5'
import { PiUsersFourLight } from 'react-icons/pi'
import { GoLocation } from 'react-icons/go'
import { TbCloudDataConnection } from 'react-icons/tb'
import { ImConnection } from 'react-icons/im'
import { LiaFileInvoiceDollarSolid, LiaFileInvoiceSolid } from 'react-icons/lia'
import { BsChatText } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { FaRegFile } from 'react-icons/fa'
import {
    BarsOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SecurityScanOutlined
} from "@ant-design/icons"
import { MenuLink } from "@layout/menuLink"

type MenuItems = {
    key: string,
    icon?: any,
    label: any,
    path?: string,
    type?: string,
    children?: MenuItems[]
}

const menuItems: MenuItems[] = [
    {
        key: '1',
        icon: <HomeOutlined style={{ fontSize: '20px' }} />,
        label: <MenuLink title="Dashboard" path="/" />,
        path: '/'
    },
    {
        key: '2',
        icon: <FiUsers style={{ fontSize: '21px' }} />,
        label: <MenuLink title="Users" path="/users" />,
        path: '/users'
    },
    {
        key: '3',
        icon: <SecurityScanOutlined style={{ fontSize: '20px' }} />,
        label: <MenuLink title="Roles" path="/roles" />,
        path: '/roles'
    },
    {
        key: '4',
        icon: <BarsOutlined style={{ fontSize: '21px' }} />,
        label: <MenuLink title="Scrum Boards" path="/boards" />,
        path: '/boards'
    },
    {
        key: '5',
        icon: <BsChatText style={{ fontSize: '21px' }} />,
        label: <MenuLink title="Chat Rooms" path="/chat" />,
        path: '/chat'
    },
    {
        key: '6',
        icon: <IoNotificationsOutline style={{ fontSize: '21px' }} />,
        label: <MenuLink title="Notifications" path="/notifications" />,
        path: '/notifications'
    },
    {
        key: '7',
        icon: <FaRegFile style={{ fontSize: '20px' }} />,
        label: <MenuLink title="Logs" path="/logs" />,
        path: '/logs'
    },
    {
        key: '8',
        label: 'Company',
        type: 'group',
        children: [
            {
                key: '9',
                icon: <PiUsersFourLight style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Customers" path="/customers" />,
                path: '/customers'
            },
            {
                key: '10',
                icon: <GoLocation style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Locations" path="/locations" />,
                path: '/locations'
            },
            {
                key: '11',
                icon: <TbCloudDataConnection style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Internet Service Providers" path="/isp" />,
                path: '/isp'
            },
            {
                key: '12',
                icon: <MdOutlineUnsubscribe style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Customers Subscriptions" path="/subscriptions" />,
                path: '/subscriptions'
            },
        ]
    },
    {
        key: '13',
        label: 'Invoices',
        type: 'group',
        children: [
            {
                key: '14',
                icon: <LiaFileInvoiceSolid style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Office Invoices" path="/invoices/office" />,
                path: '/invoices/office'
            },
            {
                key: '15',
                icon: <LiaFileInvoiceSolid style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Maintenance Invoices" path="/invoices/maintenance" />,
                path: '/invoices/maintenance'
            },
            {
                key: '16',
                icon: <LiaFileInvoiceDollarSolid style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Subscription Invoices" path="/invoices/subscription" />,
                path: '/invoices/subscription'
            },
        ]
    },
    {
        key: '17',
        label: 'Services',
        type: 'group',
        children: [
            {
                key: '18',
                icon: <MdHomeRepairService style={{ fontSize: '20px' }} />,
                label: <MenuLink title="IT Services" path="/services/it" />,
                path: '/services/it'
            },
            {
                key: '19',
                icon: <ImConnection style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Internet Services" path="/services/internet" />,
                path: '/services/internet'
            },
        ]
    },
    {
        key: '20',
        label: 'Products',
        type: 'group',
        children: [
            {
                key: '21',
                icon: <MdOutlineProductionQuantityLimits style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Products" path="/products" />,
                path: '/products'
            },
            {
                key: '22',
                icon: <MdOutlineInventory2 style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Products Inventory" path="/products/inventory" />,
                path: '/products/inventory'
            },
        ]
    },
    {
        key: '23',
        label: 'Assets',
        type: 'group',
        children: [
            {
                key: '24',
                icon: <MdWebAsset style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Assets" path="/assets" />,
                path: '/assets'
            },
            {
                key: '25',
                icon: <MdOutlineInventory2 style={{ fontSize: '20px' }} />,
                label: <MenuLink title="Assets Inventory" path="/assets/inventory" />,
                path: '/assets/inventory'
            },
        ]
    },
]

const SiderBarSection = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const currentPath = useLocation()
    const [selectedKeys, setSelectedKeys] = useState<string[]>()

    useEffect(() => {
        const isExists = menuItems.some(
            (item: MenuItems) => item.path === currentPath?.pathname
                || item?.children?.some((child: MenuItems) => child.path === currentPath.pathname)
        )

        if (isExists) {
            menuItems.some((item: MenuItems) => {
                if (item?.path === currentPath?.pathname) {
                    setSelectedKeys([item?.key])
                } else if (item.children) {
                    item?.children?.map((child: MenuItems) => {
                        if (child?.path === currentPath?.pathname) setSelectedKeys([child?.key])
                    })
                }
            })
        } else {
            setSelectedKeys([currentPath?.pathname])
        }
    }, [currentPath])

    return (
        <>
            <Button
                type="text"
                icon={!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={showDrawer}
                style={{
                    fontSize: '16px',
                    height: 64,
                    width: 64
                }}
            />

            <Drawer
                placement={'left'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'left'}
                width={'auto'}
                style={{
                    padding: '0px',
                    backgroundColor: '#001529',
                    color: 'white',
                }}
            >
                <Typography
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '18px',
                        marginBottom: '1em'
                    }}
                >
                    Extreme Engineering
                </Typography>
                <Menu
                    theme="dark"
                    mode='inline'
                    items={menuItems}
                    selectedKeys={selectedKeys}
                />
            </Drawer>
        </>
    )
}

export default SiderBarSection