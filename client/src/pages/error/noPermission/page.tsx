import { Box, Heading, Text } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'

const NoPermissionPage = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <WarningTwoIcon boxSize={'50px'} color={'red'} mt={'10%'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                No Permission
            </Heading>
            <Text color={'gray.500'}>
                You don't have permission to access this page.
            </Text>
        </Box>
    )
}

export default NoPermissionPage