import { useState, useEffect } from 'react'
import { BoardInfoData } from '../boardInfo/comp'
import { useSelector } from 'react-redux'
import { TokenState } from '@features/reducers/token'
import { useDispatch } from 'react-redux'
import { App, Select, Tooltip } from 'antd'
import { dispatchGetBoards, dispatchGetFavoriteBoards } from '@features/actions/scrumBoards'
import { generateResponseBody } from '@api/helpers'
import apiService from '@api/index'
import { icons } from '@pages/scrumBoard/utils/icons'
import Icon from '@ant-design/icons/lib/components/Icon'
import { checkWhiteSpaces } from '@utils/stringCheck'

const { Option } = Select

type BoardTitleProps = {
    boardInfo: BoardInfoData | any,
    setBoardInfo: (boardInfo: BoardInfoData) => void
}

const BoardIcon = ({ boardInfo, setBoardInfo }: BoardTitleProps) => {
    const initialState = {
        icon: boardInfo?.icon
    }

    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const dispatch = useDispatch()

    const [isUpdating, setIsUpdating] = useState(false)

    const [newIcon, setNewIcon] = useState(initialState)
    const { icon } = newIcon

    useEffect(() => {
        setNewIcon(initialState)
    }, [boardInfo])

    const handleUpdateIcon = async (iconT: string) => {
        if (iconT === boardInfo?.icon) {
            messageApi.open({
                type: 'error',
                content: 'Please choose a unique icon'
            })
            return
        }

        const nameWhiteSpaceCheck = checkWhiteSpaces(iconT)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Icon should not contain only whitespace'
            })
            return
        }

        const body = {
            icon: iconT
        }

        try {
            setIsUpdating(true)
            const { data } = await apiService.PUT(`/boards/icon/${boardInfo?._id}`, body, token)

            const { message, newBoardInfo, standardBoards, favoriteBoards } = data;

            setBoardInfo(newBoardInfo)
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            dispatch(dispatchGetBoards(generateResponseBody(standardBoards)))
            dispatch(dispatchGetFavoriteBoards(generateResponseBody(favoriteBoards)))

            setIsUpdating(false)
        } catch (error: any) {
            setIsUpdating(false)
            messageApi.open({
                type: 'error',
                content: await error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Tooltip title='Change Board Icon'>
                <Select
                    defaultValue={icon}
                    style={{ width: 55 }}
                    onChange={handleUpdateIcon}
                    optionLabelProp="label"
                    disabled={isUpdating}
                    bordered={false}
                    suffixIcon={null}
                >
                    {Object.keys(icons)?.map((iconT: any, index: number) => (
                        <Option
                            key={index}
                            label={<Icon component={icons[iconT]} style={{ fontSize: '18px' }} />}
                            value={iconT}
                            style={{
                                color: iconT === icon ? 'blue' : 'red'
                            }}
                        >
                            <Icon component={icons[iconT]} style={{ fontSize: '18px' }} />
                        </Option>
                    ))}
                </Select>
            </Tooltip>
        </>
    )
}

export default BoardIcon