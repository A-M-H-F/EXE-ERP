import { Box, Flex, useToast } from '@chakra-ui/react'
import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import { useState } from 'react'
import { SectionTitle } from '../sectionTitle'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import { useSelector } from 'react-redux'
import { DeleteSection } from '../deleteSection'
import { AddNewTask } from '../addNewTask'

type BoardSectionProps = {
    section: BoardSectionData,
    boardInfo: BoardInfoData | any,
    setBoardSections: (sections: [BoardSectionData]) => void
}

export type TaskData = {
    sectionId: string,
    title: string,
    content: string,
    position: number
}

const BoardSection = ({ section, boardInfo, setBoardSections }: BoardSectionProps) => {
    const toast = useToast()
    const { user: currentUser } = useSelector((state: any) => state.auth)
    const token = useSelector((state: any) => state.token)
    const isCreator = isBoardCreator(boardInfo?.creator, currentUser?._id)

    const [sectionTasks, setSectionTasks] = useState<Array<TaskData>>([])


    const getSectionTasks = async () => {

    }

    return (
        <>
            <Box
                borderRadius={5}
                p={'3'}
                boxShadow={'lg'}
                minW={'350px'}
                mb={'3'}
            >
                <Flex>
                    <AddNewTask sectionId={section._id} setSectionTasks={setSectionTasks} />
                    <SectionTitle sectionInfo={section} boardInfo={boardInfo} />
                    <DeleteSection
                        sectionInfo={section}
                        boardInfo={boardInfo}
                        setBoardSections={setBoardSections}
                    />
                </Flex>
            </Box>
        </>
    )
}

export default BoardSection