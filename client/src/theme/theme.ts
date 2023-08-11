import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { globalStyles } from './styles'
import breakpoints from './breakpoints'

const config: ThemeConfig = {
    initialColorMode: 'light', // 'dark' | 'light'
    useSystemColorMode: false,
}

const theme = extendTheme({ config }, breakpoints, globalStyles)

export default theme
