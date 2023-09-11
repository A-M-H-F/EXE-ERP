import { PrinterOutlined } from '@ant-design/icons'
import { AuthState } from '@features/reducers/auth'
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Spin } from 'antd'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import './index.css'
import apiService from '@api/index'
import { dispatchGetSubscriptionsInvoices } from '@features/actions/subscriptionInvoices'
import { SubscriptionInvoicePrintTemplate } from '../printTemplate'

type PrintSubscriptionInvoiceProps = {
    invoice: SubscriptionInvoice,
    handleCancel: () => void,
    subscriptionInvoicesList: SubscriptionInvoice[]
}

const PrintSubscriptionInvoice = ({ invoice, handleCancel, subscriptionInvoicesList }: PrintSubscriptionInvoiceProps) => {
    const { message: messageApi } = App.useApp()
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()

    // state
    const [printing, setPrinting] = useState<boolean>(false)

    // print ref
    const componentRef = useRef<any>()

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
            setPrinting(true)
            const { data } = await apiService.PUT(`/subscription-invoice/print/${invoice._id}`, body, token)

            const { message, result } = data

            messageApi.success({
                content: message,
                duration: 2
            })

            if (result) {
                const updatedList = subscriptionInvoicesList.map((sub) => {
                    if (sub._id === invoice._id) {
                        return { ...result }
                    }
                    return sub
                })
                dispatch(dispatchGetSubscriptionsInvoices(updatedList))
            }

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
        <Spin spinning={printing}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ReactToPrint
                    trigger={() => (
                        <Button type="primary"
                            icon={<PrinterOutlined />}
                        >
                            Print
                        </Button>
                    )}
                    content={() => componentRef?.current}
                    onBeforePrint={handleBeforePrint}
                    onAfterPrint={handleAfterPrint}
                    onPrintError={() => console.log('Error while printing.')}
                />
            </div>

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
        </Spin>
    )
}

export default PrintSubscriptionInvoice