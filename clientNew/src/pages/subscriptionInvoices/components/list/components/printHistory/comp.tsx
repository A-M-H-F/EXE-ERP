import { HistoryOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Empty, Modal, Spin, Timeline, Tooltip } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

type SubscriptionInvoicePrintHistoryProps = {
    id: string
}

type History = {
    _id: string,
    printedBy: {
        name: string,
        _id: string,
    },
    printDate: Date,
}

const SubscriptionInvoicePrintHistory = ({ id }: SubscriptionInvoicePrintHistoryProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()

    // state
    const [history, setHistory] = useState<History[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const { data } = await apiService.GET(`/subscription-invoice/history/${id}`, token)

            const sorted = data?.printHistory?.sort((a: any, b: any) => {
                const dateA = new Date(a.printDate as string).getTime();
                const dateB = new Date(b.printDate as string).getTime();
                return dateB - dateA;
            })

            setHistory(sorted)

            setTimeout(() => {
                setLoading(false)
            }, 300)
        } catch (error: any) {
            messageApi.error({
                content: error?.response?.data?.message,
            })
        }
    }

    useEffect(() => {
        if (id && isModalOpen) fetchHistory()
    }, [id, isModalOpen])

    useEffect(() => {
        socketProvider.on('getSubscriptionInvoiceHistory_to_client', async function ({
            invoiceId
        }) {
            if (invoiceId !== id) {
                await fetchHistory()
            }
        })

        return () => {
            socketProvider.off("getSubscriptionInvoiceHistory_to_client", fetchHistory)
        }
    }, [])

    const items = history?.map((line) => (
        {
            color: 'blue',
            children: (
                <>
                    <p>{new Date(line.printDate).toLocaleDateString('en-GB')}</p>
                    <p>Printed By: <a>{line.printedBy.name}</a></p>
                </>
            ),
            key: line._id,
        }
    ))

    return (
        <>
            <Tooltip title='View Print History'>
                <HistoryOutlined
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Print History"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={<></>}
            >
                <Spin spinning={loading}>
                    {history && history?.length > 0 ?
                        <div
                            style={{
                                maxHeight: '600px',
                                overflowX: 'auto'
                            }}
                        >
                            {history && <Timeline
                                items={items}
                            />}
                        </div>
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </Spin>
            </Modal>
        </>
    )
}

export default SubscriptionInvoicePrintHistory