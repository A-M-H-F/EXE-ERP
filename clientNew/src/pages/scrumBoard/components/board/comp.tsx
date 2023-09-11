import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useParams } from 'react-router-dom'
import { Space, Typography } from 'antd'
import { BoardInfo } from '../boardInfo'

const { Text } = Typography

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
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center'
              }}
            >
              <Space direction='vertical'
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  textAlign: 'center'
                }}
              >
                <BeatLoader color="#36d7b7" />
                <div
                  style={{
                    boxShadow: 'dark',
                    padding: 2,
                    borderRadius: 5,
                    color: '#F2F4FA',
                  }}
                >
                  <Text>
                    Please Select A Board
                  </Text>
                </div>
              </Space>
            </div>
          </>
          :
          <BoardInfo />
      }
    </>
  )
}

export default ScrumBoard