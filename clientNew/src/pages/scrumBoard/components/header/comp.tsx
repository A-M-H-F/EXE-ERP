import { useEffect, useState } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { useNavigate, useParams } from 'react-router-dom'
import { App, Button, Divider, Modal, Skeleton, Space, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { AuthState } from '@features/reducers/auth'
import { TokenState } from '@features/reducers/token'
import { useDispatch } from 'react-redux'
import { isBoardCreator } from '@pages/scrumBoard/utils/user'
import { useSocket } from '@socket/provider/socketProvider'
import apiService from '@api/index'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { generateResponseBody } from '@api/helpers'
import { BoardIcon } from '../boardIcon'
import { BoardTitle } from '../boardTitle'
import { DeleteOutlined } from '@ant-design/icons'
import { useWindowDimensions } from '@hooks/useWindowDimensions'

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const ScrumBoardHeader = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const { boardId } = useParams()
    const history = useNavigate()
    const { message: messageApi } = App.useApp()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const token = useSelector((state: TokenState) => state.token)
    const dispatch = useDispatch()
    const isCreator = isBoardCreator(boardInfo?.creator, currentUser?._id)
    const { socketProvider } = useSocket()

    const { screenSizes } = useWindowDimensions()
    const { xs, sm } = screenSizes

    const [isLoaded, setIsLoaded] = useState(false)

    const handleCloseBoard = () => {
        setIsLoaded(true)
        history('/boards')
    }

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleDeleteBoard = async () => {
        if (!isCreator) {
            setIsDeleting(false)
            return
        }

        try {
            const { data } = await apiService.DELETE(`/boards/${boardInfo?._id}`, token)

            const { message, standardBoards, favoriteBoards } = data;

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))

            // send socket event
            const newUsersList = boardInfo?.users?.map((user: any) => {
                return {
                    user: user?.user?._id
                }
            })?.filter((u: any) => u?.user !== currentUser?._id)
            socketProvider.emit('deleteBoard_to_server', { users: newUsersList })

            history('/boards')
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleOk = () => {
        setIsDeleting(true)
        setTimeout(() => {
            handleDeleteBoard()
            setIsModalOpen(false)
        }, 1000)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        setIsLoaded(true)
        setTimeout(() => {
            setIsLoaded(false)
        }, 500)
    }, [boardId])

    return (
        <Skeleton loading={isLoaded}
            style={{
                borderRadius: 5,
                padding: 0
            }}
            active
        >
            <div
                style={{
                    minHeight: '4em',
                    paddingInline: 10,
                    borderRadius: 5,
                    boxShadow: '5px 5px darkgray',
                    backgroundColor: 'white',
                    border: 'solid 1px dodgerblue',
                    marginLeft: '2px',
                    marginTop: '5px'
                }}
            >
                <div
                    style={{
                        display: xs || sm ? 'block' : 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1em',
                        marginBottom: '1em',
                    }}
                >
                    <Space direction='horizontal'>
                        {isCreator &&
                            <BoardIcon
                                boardInfo={boardInfo} setBoardInfo={setBoardInfo}
                            />
                        }

                        <BoardTitle boardInfo={boardInfo} setBoardInfo={setBoardInfo} />
                    </Space>

                    {xs || sm ?
                        <Divider />
                        : null}

                    <div
                        style={{
                            marginTop: xs || sm ? '0.2em' : '',
                            display: xs || sm ? 'flex' : '',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Tooltip title="Delete Board">
                            <Button
                                onClick={showModal}
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>

                        {boardId ?
                            <Button onClick={handleCloseBoard} type='primary'
                                style={{
                                    marginLeft: '0.5em'
                                }}
                            >
                                Close Board
                            </Button>
                            : null
                        }
                    </div>
                </div>

                <Modal
                    title='Are you sure, you want to delete this Board?'
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    centered
                    closable={false}
                    maskClosable={false}
                    confirmLoading={isDeleting}
                    okType='danger'
                />
            </div>
        </Skeleton>
    )
}

export default ScrumBoardHeader