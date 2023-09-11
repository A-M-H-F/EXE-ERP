import { ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons'
import { AuthState } from '@features/reducers/auth'
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Modal, Tooltip } from 'antd'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import './index.css'
import apiService from '@api/index'
import { SubscriptionInvoicePrintTemplate } from '@pages/subscriptionInvoices/components/printTemplate'

type PrintSubInvoiceProps = {
    invoice: SubscriptionInvoice,
}

const PrintSubInvoice = ({ invoice }: PrintSubInvoiceProps) => {
    const { message: messageApi } = App.useApp()
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }

    // state
    const [printing, setPrinting] = useState<boolean>(false)

    // print ref
    const componentRef = useRef<any>()
    const handleCallPrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => handleAfterPrint(),
        onBeforePrint: () => handleBeforePrint(),
        onPrintError: () => messageApi.error({ content: 'Error while printing' })
    })

    const handleBeforePrint = () => {
        setPrinting(true)
    }

    const handleAfterPrint = () => {
        handlePrint()
    }

    const handlePrint = async () => {
        const body = {
            printDate: new Date()
        }

        try {
            const { data } = await apiService.PUT(`/subscription-invoice/print/${invoice._id}`, body, token)

            const { message } = data

            messageApi.success({
                content: message,
                duration: 2
            })

            socketProvider.emit('getSubscriptionInvoices_to_server', { userId: currentUser?._id })
            socketProvider.emit('getSubscriptionInvoiceHistory_to_server', { invoiceId: invoice._id })

            setPrinting(false)
            handleCancel()
        } catch (error: any) {
            setPrinting(false)
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Tooltip title='Print'>
                <PrinterOutlined onClick={showModal}
                    style={{
                        color: 'blue',
                        fontSize: '16px'
                    }}
                />
            </Tooltip>

            <Modal
                title={(
                    <>
                        <ExclamationCircleOutlined
                            style={{
                                marginRight: '0.5em',
                                color: 'orange',
                                fontSize: '20px'
                            }}
                        />
                        Please confirm by clicking{' '}
                        <span style={{ color: 'orange' }}>
                            Print Now
                        </span>
                    </>
                )}
                centered
                open={isModalOpen}
                onCancel={handleCancel}
                confirmLoading={printing}
                onOk={handleCallPrint}
                okText={'Print Now'}
                closable={false}
            />

            <div
                ref={componentRef}
                style={{
                    width: '8cm',
                    height: '100%',
                    margin: '0 auto',
                    marginTop: '2em',
                }}
                className="print-only"
            >
                <SubscriptionInvoicePrintTemplate invoice={invoice} />
            </div>
        </>
    )
}

export default PrintSubInvoice