import { Box, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import BoardInfo from '../boardInfo/comp'
import { useParams } from 'react-router-dom'

const ScrumBoard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { boardId }: string | any = useParams()

  useEffect(() => {
    if (boardId) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [boardId])

  return (
    <>
      {
        isLoading ?
          <>
            <VStack minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
              <BeatLoader color="#36d7b7" />
              <Box
                boxShadow={'dark-lg'}
                p={2}
                borderRadius={5}
                bgColor={'#3457D5'}
                color={'#F2F4FA'}
              >
                <Text>
                  Please Select A Board
                </Text>
              </Box>
            </VStack>
          </>
          :
          <BoardInfo />
      }
    </>
  )
}

export default ScrumBoard