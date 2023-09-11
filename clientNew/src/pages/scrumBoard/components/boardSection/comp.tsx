import { BoardInfoData, BoardSectionData } from '../boardInfo/comp'
import { Card, Space } from 'antd'
import { AddNewTask } from '../addNewTask'
import { SectionTitle } from '../sectionTitle'
import { DeleteSection } from '../deleteSection'
import { Draggable } from 'react-beautiful-dnd'
import { SectionTask } from '../sectionTask'

type BoardSectionProps = {
    section: BoardSectionData,
    boardInfo: BoardInfoData | any,
    setBoardSections: (sections: BoardSectionData[]) => void,
    boardSections: BoardSectionData[]
}

const BoardSection = ({ section, boardInfo, setBoardSections, boardSections }: BoardSectionProps) => {
    return (
        <>
            <Card
                hoverable
                style={{
                    minWidth: '350px',
                    minHeight: '600px',
                    marginBottom: 3,
                    marginRight: '2em',
                    padding: 3
                }}
                title={
                    <Space
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <AddNewTask
                            sectionId={section?._id}
                            boardSections={boardSections}
                            setBoardSections={setBoardSections}
                            boardInfo={boardInfo}
                        />

                        <SectionTitle
                            sectionInfo={section}
                            boardInfo={boardInfo}
                            setBoardSections={setBoardSections}
                            boardSections={boardSections}
                        />

                        <DeleteSection
                            sectionInfo={section}
                            boardInfo={boardInfo}
                            setBoardSections={setBoardSections}
                            boardSections={boardSections}
                        />
                    </Space>
                }
            >
                <div
                    style={{
                        borderRadius: 5,
                        padding: 3,
                        minWidth: '350px',
                        marginBottom: 3,
                    }}
                >
                    {section?.tasks?.map((task: any, index: any) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                                <div
                                    style={{
                                        borderRadius: 5,
                                        padding: 2,
                                        minWidth: '350px',
                                        marginBottom: 3
                                    }}
                                    
                                    key={task?._id}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <SectionTask
                                        task={task}
                                        setBoardSections={setBoardSections}
                                        boardSections={boardSections}
                                        boardInfo={boardInfo}
                                    />
                                </div>
                            )}
                        </Draggable>
                    ))}
                </div>
            </Card>
        </>
    )
}

export default BoardSection