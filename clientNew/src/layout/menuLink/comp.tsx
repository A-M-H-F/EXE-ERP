import React from 'react'
import { useLocation, Link } from 'react-router-dom';

interface MenuLinkProps {
    path: string;
    title: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({ path, title }) => {
    const currentPath = useLocation()
    const isCurrentPath = currentPath.pathname === path

    if (isCurrentPath) {
        return (
            title
        )
    }

    return (
        <Link to={path}>
            {title}
        </Link>
    )
}

export default MenuLink