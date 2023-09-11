import { QrcodeOutlined } from '@ant-design/icons'
import { Modal, QRCode, Tooltip } from 'antd'
import { useState } from 'react'

type ViewSubscriptionInvoiceQrCodeProps = {
    invoiceId: string,
}
const ViewSubscriptionInvoiceQrCode = ({ invoiceId }: ViewSubscriptionInvoiceQrCodeProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <Tooltip title='View QrCode'>
                <QrcodeOutlined onClick={showModal}
                    style={{
                        color: 'orange',
                        fontSize: '16px'
                    }}
                />
            </Tooltip>

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={<></>}
                closable={false}
                style={{
                    maxWidth: 'fit-content',
                }}
                centered
            >
                <div>
                    <QRCode
                        value={invoiceId}
                        errorLevel='H'
                        size={270}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ViewSubscriptionInvoiceQrCode