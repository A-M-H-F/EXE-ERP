import { HistoryOutlined } from '@ant-design/icons'
import { Empty, Input, Modal, Space, Timeline, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { TaskData, TaskEditHistoryData } from '../boardInfo/comp'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'

type TaskMoveHistoryProps = {
    task: TaskData,
}

const TaskEditHistory = ({ task }: TaskMoveHistoryProps) => {
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

    const timeLineData = task?.editHistory?.map((edit: TaskEditHistoryData) => (
        {
            color: 'green',
            children: (
                <>
                    <Typography>
                        {new Date(edit.date).toLocaleDateString('en-Gb')}
                    </Typography>
                    <div>
                        Edited By:{' '}
                        <Tooltip title={currentUser?._id === edit.editedBy._id ?
                            'View Your Profile' :
                            'View User Profile'
                        }>
                            <Typography.Link href={`/users/${edit.editedBy._id}`} target='_blank'>
                                {currentUser?._id === edit.editedBy._id ?
                                    'You' :
                                    edit.editedBy.name
                                }
                            </Typography.Link>
                        </Tooltip>
                    </div>

                    <Typography.Text>
                        <span style={{ fontWeight: 600 }}>
                            Title
                        </span>: {edit.title?.length > 0 ? edit.title : 'Not Edited'}
                    </Typography.Text>

                    <div>
                        <span style={{ fontWeight: 600 }}>
                            Content
                        </span>:
                        {edit.content?.length > 0 ?
                            <Input.TextArea
                                value={edit.content}
                                readOnly
                                onChange={(e: any) => e}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                            : ' Not Edited'}
                    </div>
                </>
            )
        }
    ))?.reverse()

    return (
        <>
            <Space onClick={showModal}>
                <HistoryOutlined />
                Edit History
            </Space>

            <Modal
                title="Task Edit History"
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
                        maxHeight: '500px',
                        overflowY: 'scroll'
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

export default TaskEditHistory