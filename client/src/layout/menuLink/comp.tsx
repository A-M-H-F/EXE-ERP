import React, { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Flex, Text } from '@chakra-ui/react'

interface MenuLinkProps {
  icon: ReactElement;
  iconSize: number;
  mb: string;
  path: string;
  title: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({ icon, iconSize, mb, path, title }) => {
  const currentPath = useLocation()

  const isCurrentPath = currentPath.pathname === path

  if (isCurrentPath) {
    return (
      <Box
        borderRadius={10}
        mb={mb}
        p={2}
        bgColor="#012169"
        opacity={1}
        cursor="default"
      >
        <Flex color="#F2F4FA">
          {React.cloneElement(icon, { size: iconSize })}
          <Text fontSize="18px" fontWeight="medium" ml="1em">
            {title}
          </Text>
        </Flex>
      </Box>
    )
  }

  return (
    <Link to={path}>
      <Box
        border={'none'}
        borderRadius={10}
        mb={mb}
        bgColor={''}
        // 002fa7
        p={2}
        opacity={0.9} // 1 - 0.9 - 0.8
        _hover={{
          bgColor: '#002fa7',
          opacity: 1,
        }}
      >
        <Flex color={'#F2F4FA'}>
          {React.cloneElement(icon, { size: iconSize })}
          <Text fontSize={'18px'} fontWeight={'medium'} ml={'1em'}>
            {title}
          </Text>
        </Flex>
      </Box>
    </Link>
  )
}

export default MenuLink