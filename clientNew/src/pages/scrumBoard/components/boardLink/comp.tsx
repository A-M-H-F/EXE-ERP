import Icon, { StarOutlined } from '@ant-design/icons'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { TokenState } from '@features/reducers/token'
import { icons } from '@pages/scrumBoard/utils/icons'
import { App, Col, Row, Space, Typography } from 'antd'
import { useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const { Text } = Typography

export type BoardLinkProps = {
    title: string,
    _id: string,
    icon: any,
    favorite: boolean
}

const BoardLink = ({ title, _id, icon, favorite }: BoardLinkProps) => {
    const { boardId } = useParams()
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()

    const [isFavorite, setIsFavorite] = useState(false)

    const handleMouseEnter = () => {
        setIsFavorite(true);
    }

    const handleMouseLeave = () => {
        setIsFavorite(false);
    }

    const handleUpdateBoardFavoriteStatus = async () => {
        try {
            const body = {
                status: !favorite
            }

            const { data } = await apiService.PUT(`/boards/status/${_id}`, body, token)

            const { message, standardBoards, favoriteBoards } = data

            messageApi.open({
                type: 'success',
                content: message,
                duration: 1
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))
        } catch (error: any) {
            messageApi.open({
                type: 'success',
                content: await error?.response?.data?.message,
                duration: 2
            })
        }
    }

    if (boardId === _id) {
        return (
            <>
                <Row>
                    <Col
                        span={20}
                        style={{
                            marginBottom: '0.6em',
                            borderRadius: 10,
                            border: 'none'
                        }}
                    >
                        <Space
                            style={{
                                color: '#F2F4FA',
                                fontSize: '18px',
                                borderRadius: 10,
                                padding: 4,
                                alignItems: 'center',
                                minWidth: '100%',
                                backgroundColor: '#012169',
                                cursor: 'grabbing'
                            }}
                        >
                            <Icon component={icons[icon]}
                                style={{
                                    marginRight: '0.2em'
                                }}
                            />
                            <Text
                                style={{
                                    color: '#F2F4FA',
                                    fontWeight: 'bold',
                                    marginLeft: '0.5em'
                                }}
                            >
                                {title}
                            </Text>
                        </Space>
                    </Col>

                    <Col>
                        <Icon
                            component={favorite || isFavorite ? AiFillStar : StarOutlined}
                            style={{
                                color: 'red',
                                fontSize: '22px',
                                marginTop: '0.3em',
                                marginLeft: '0.1em'
                            }}
                            onClick={handleUpdateBoardFavoriteStatus}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <>
            <Row>
                <Col
                    span={20}
                    style={{
                        marginBottom: '0.6em',
                        borderRadius: 10,
                        border: 'none'
                    }}
                >
                    <Link key={_id} to={`/boards/${_id}`}>
                        <Space
                            style={{
                                color: '#F2F4FA',
                                fontSize: '18px',
                                borderRadius: 10,
                                padding: 4,
                                alignItems: 'center',
                                minWidth: '100%',
                                cursor: 'grabbing'
                            }}
                        >
                            <Icon component={icons[icon]}
                                style={{
                                    marginRight: '0.2em'
                                }}
                            />
                            <Text
                                style={{
                                    color: '#F2F4FA',
                                    fontWeight: 'bold',
                                    marginLeft: '0.5em'
                                }}
                            >
                                {title}
                            </Text>
                        </Space>
                    </Link>
                </Col>

                <Col>
                    <Icon
                        component={favorite || isFavorite ? AiFillStar : StarOutlined}
                        style={{
                            color: 'red',
                            fontSize: '22px',
                            marginTop: '0.3em',
                            marginLeft: '0.1em'
                        }}
                        onClick={handleUpdateBoardFavoriteStatus}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                </Col>
            </Row>
        </>
    )
}

export default BoardLink