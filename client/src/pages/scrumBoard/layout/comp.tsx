import { Grid, GridItem } from '@chakra-ui/react'
import { ScrumBoardSideBar } from '../components/sidebar'
import { ScrumBoard } from '../components/board'

const ScrumBoardLayout = () => {
    return (
        <>
            <Grid
                templateAreas={`"sidebar main"
                  "sidebar main"`}
                gridTemplateRows={'59px 1fr 30px'}
                gridTemplateColumns={'250px 1fr'}
                h='100vh'
                w='100%'
                gap='0'
            >
                <GridItem area={'sidebar'} >
                    <ScrumBoardSideBar />
                </GridItem>

                <GridItem pb={20} area={'main'} p={2} overflow={'auto'}>
                    <ScrumBoard />
                </GridItem>
            </Grid>
        </>
    )
}

export default ScrumBoardLayout