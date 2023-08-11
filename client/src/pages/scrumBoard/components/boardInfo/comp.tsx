import apiService from '@api/index'
import { Box, Flex, HStack, SimpleGrid, Skeleton, VStack, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BoardUser } from '../boardUser'
import { AddUserToBoard } from '../addUserToBoard'
import { BoardDescription } from '../boardDescription'
import { ScrumBoardHeader } from '../header'
import { useParams } from 'react-router-dom'
import { AddNewSection } from '../addNewSection'
import { BoardSection } from '../section'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

export interface BoardUserInfo {
  user: {
    name: string;
    _id: string;
    picture: string;
  };
}

export type BoardInfoData = {
  _id: string,
  creator: string,
  users: Array<BoardUserInfo>,
  icon: string,
  title: string,
  description: string
}

export type BoardSectionData = {
  _id: string,
  title: string,
  boardId: string
}

const BoardInfo = () => {
  const token = useSelector((state: any) => state.token)
  const toast = useToast()
  const { boardId }: string | any = useParams()

  const [boardInfo, setBoardInfo] = useState<BoardInfoData>()

  const [boardSections, setBoardSections] = useState<Array<BoardSectionData>>([])

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
    setTimeout(() => {
      setIsLoaded(true)
    }, 2000)
  }, [boardId])

  const handleGetBoardInfo = async () => {
    try {
      const { data } = await apiService.GET(`/boards/${boardId}`, token)

      setBoardInfo(data)
    } catch (error: any) {
      toast({
        description: await error?.response?.data?.message,
        status: 'error',
        duration: 2000,
        position: 'top-right',
        isClosable: true
      })
    }
  }

  const getBoardSections = async () => {
    try {
      const { data } = await apiService.GET(`/boards/sections/${boardId}`, token)

      setBoardSections(data)
    } catch (error: any) {
      toast({
        description: await error?.response?.data?.message,
        status: 'error',
        duration: 2000,
        position: 'top-right',
        isClosable: true
      })
    }
  }

  useEffect(() => {
    if (boardId !== '' || boardId !== '') {
      handleGetBoardInfo()

      getBoardSections()
    }
  }, [boardId])

  return (
    <>
      <ScrumBoardHeader
        boardInfo={boardInfo} setBoardInfo={setBoardInfo}
      />

      <VStack>
        <Box
          mt={'1em'}
          borderRadius={5}
          w={'100%'}
          p={'3'}
          boxShadow={'lg'}
        >
          <Skeleton isLoaded={isLoaded} borderRadius={5}>
            <BoardDescription boardInfo={boardInfo} setBoardInfo={setBoardInfo} />

            <Flex>
              <SimpleGrid columns={11} spacing={2} mt={'0.5em'} w={'100%'}>
                {boardInfo?.users?.map((user: BoardUserInfo) => (
                  <BoardUser
                    boardInfo={boardInfo}
                    key={user.user._id}
                    user={user}
                    setBoardInfo={setBoardInfo}
                  />
                ))}
                <AddUserToBoard boardInfo={boardInfo} setBoardInfo={setBoardInfo} />
              </SimpleGrid>

              <AddNewSection boardId={boardId} setBoardSections={setBoardSections} />
            </Flex>
          </Skeleton>
        </Box>
      </VStack>

      <Skeleton isLoaded={isLoaded} borderRadius={5}>
        <Box
          mt={'1em'}
          borderRadius={5}
          p={'3'}
          boxShadow={'lg'}
        >
          <HStack overflowX="auto" spacing={6}>
            {boardSections?.map((section: BoardSectionData) => (
              <Box
                key={section._id}
              >
                <BoardSection section={section} boardInfo={boardInfo} setBoardSections={setBoardSections} />
              </Box>
            ))}
          </HStack>
        </Box>
      </Skeleton>
    </>
  )
}

export default BoardInfo