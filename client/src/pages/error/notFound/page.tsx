import image from './assets/images/404.svg'
import { Link } from 'react-router-dom'
import { Text, Image, Container, SimpleGrid, Heading, Button, Stack } from "@chakra-ui/react"
import useDocumentMetadata from '@hooks/useDocumentMetadata'

const NotFound = () => {
    useDocumentMetadata('EX - Not Found', 'Extreme Engineering - Not Found 404')

    return (
        <Container mt={20} >
            <SimpleGrid>
                <Image src={image} />
                <Stack>
                    <Heading>Something is not right...</Heading>
                    <Text color="dimmed" size="lg">
                        Page you are trying to open does not exist. You may have mistyped the address, or the
                        page has been moved to another URL. If you think this is an error contact support.
                    </Text>
                    <Link to={'/'}>
                        <Button variant="outline" size="md" mt="xl">
                            Get back to home page
                        </Button>
                    </Link>
                </Stack>
            </SimpleGrid>
        </Container>
    )
}

export default NotFound
