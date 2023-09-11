import { MoneyCollectOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetSubscriptionsInvoices } from '@features/actions/subscriptionInvoices'
import { AuthState } from '@features/reducers/auth'
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import { TokenState } from '@features/reducers/token'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { PrintSubscriptionInvoice } from '@pages/subscriptionInvoices/components/print'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Modal, Spin, Steps, Tooltip } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

type CollectSubscriptionInvoiceProps = {
    invoice: SubscriptionInvoice,
    subscriptionInvoicesList: SubscriptionInvoice[]
}

const CollectSubscriptionInvoice = ({ invoice, subscriptionInvoicesList }: CollectSubscriptionInvoiceProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const dispatch = useDispatch()
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
        setCurrent(0)
        setIsModalOpen(false)
    }

    // state
    const [updating, setUpdating] = useState<boolean>(false)

    const steps = [
        {
            title: 'Collect Invoice',
            content: '',
        },
        {
            title: 'Print Invoice',
            content: '',
        }
    ]
    const items = steps.map((item) => ({ key: item.title, title: item.title }))
    const [current, setCurrent] = useState(0);

    const handleCollect = async () => {
        try {
            setUpdating(true)
            const { data } = await apiService.PUT(`/subscription-invoice/collect/${invoice._id}`, {}, token)

            const { message, result } = data

            messageApi.success({
                content: message,
                duration: 2
            })

            if (result) {
                const updatedList = subscriptionInvoicesList.map((subInvoice) => {
                    if (subInvoice._id === invoice._id) {
                        return { ...result }
                    }
                    return subInvoice
                })
                dispatch(dispatchGetSubscriptionsInvoices(updatedList))
            }

            socketProvider.emit('getSubscriptionInvoices_to_server', { userId: currentUser?._id })

            setUpdating(false)
            setCurrent(1)
        } catch (error: any) {
            setUpdating(false)
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Tooltip title='Collect Money & Print'>
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
                footer={<></>}
            >
                <Spin spinning={updating}>
                    <Steps current={current} items={items} />

                    <div>{steps[current].content}</div>

                    <div style={{ marginTop: '2em', display: 'flex', justifyContent: 'center' }}>
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={handleCollect}
                                disabled={updating}
                            >
                                Collect
                            </Button>
                        )}
                    </div>

                    <div>
                        {current === steps.length - 1 && invoice &&
                            <PrintSubscriptionInvoice
                                invoice={invoice}
                                handleCancel={handleCancel}
                                subscriptionInvoicesList={subscriptionInvoicesList}
                            />
                        }
                    </div>
                </Spin>
            </Modal>
        </>
    )
}

export default CollectSubscriptionInvoice