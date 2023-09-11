import { HistoryOutlined } from '@ant-design/icons'
import { Empty, Modal, Space, Timeline, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { TaskData, TaskMoveHistoryData } from '../boardInfo/comp'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'

type TaskMoveHistoryProps = {
    task: TaskData,
}

const TaskMoveHistory = ({ task }: TaskMoveHistoryProps) => {
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const timeLineData = task?.moveHistory?.map((history: TaskMoveHistoryData) => (
        {
            color: 'green',
            children: (
                <>
                    <Typography>
                        {new Date(history.date).toLocaleDateString('en-Gb')}
                    </Typography>
                    <div>
                        Moved By:{' '}
                        <Tooltip title={currentUser?._id === history.movedBy._id ?
                            'View Your Profile' :
                            'View User Profile'
                        }>
                            <Typography.Link href={`/users/${history.movedBy._id}`} target='_blank'>
                                {currentUser?._id === history.movedBy._id ?
                                    'You' :
                                    history.movedBy.name
                                }
                            </Typography.Link>
                        </Tooltip>
                    </div>

                    <Typography>
                        From Section: {history.from}
                    </Typography>
                    <Typography>
                        To Section: {history.to}
                    </Typography>
                </>
            )
        }
    ))?.reverse()

    return (
        <>
            <Space onClick={showModal}>
                <HistoryOutlined />
                Movement History
            </Space>

            <Modal
                title="Task Movement History"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{
                    maxHeight: '500px',
                }}
                centered
                closable={false}
            >
                <div
                    style={{
                        overflowY: 'scroll',
                        maxHeight: '500px',
                    }}
                >
                    {timeLineData?.length > 0 ?
                        <Timeline items={timeLineData}
                            style={{
                                marginTop: '1em'
                            }}
                        />
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </div>
            </Modal>
        </>
    )
}

export default TaskMoveHistory