import { MoneyCollectOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import { TokenState } from '@features/reducers/token'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

type CollectSubscriptionInvoiceProps = {
    invoice: SubscriptionInvoice,
}

const CollectSubscriptionInvoice = ({ invoice }: CollectSubscriptionInvoiceProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const { message: messageApi } = App.useApp()
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes

    // modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const showModal = () => {
        if (invoice.paymentStatus === 'paid') {
            messageApi.info({
                content: 'Already paid/collected'
            })
            return;
        }
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // state
    const [updating, setUpdating] = useState<boolean>(false)

    const handleCollect = async () => {
        try {
            setUpdating(true)
            const { data } = await apiService.PUT(`/subscription-invoice/collect/${invoice._id}`, {}, token)

            const { message } = data

            messageApi.success({
                content: message,
                duration: 2
            })

            socketProvider.emit('getSubscriptionInvoices_to_server', { userId: currentUser?._id })

            setUpdating(false)
            handleCancel()
        } catch (error: any) {
            setUpdating(false)
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Tooltip title='Collect Money'>
                <MoneyCollectOutlined
                    style={{
                        fontSize: '16px',
                        color: 'green'
                    }}
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Collect Invoice"
                open={isModalOpen}
                onCancel={handleCancel}
                centered={xs || sm || md ? false : true}
                confirmLoading={updating}
                okText='Collect Invoice'
                onOk={handleCollect}
            />
        </>
    )
}

export default CollectSubscriptionInvoice