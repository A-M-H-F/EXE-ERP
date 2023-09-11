import { CheckOutlined, LoadingOutlined, ScanOutlined } from '@ant-design/icons'
import { App, Button, Empty, Modal, Space, Spin, Steps } from 'antd'
import { useEffect, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { TokenState } from '@features/reducers/token'
import { useSelector } from 'react-redux'
import apiService from '@api/index'
import { SubscriptionInvoice, SubscriptionInvoicesListState } from '@features/reducers/subscriptionInvoices'
import { QrSubscriptionInvoiceInfo } from './info'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { PrintSubscriptionInvoice } from '../print'

const SubscriptionInvoiceQrScanner = () => {
    const { message: messageApi } = App.useApp()
    const token = useSelector((state: TokenState) => state.token)
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes
    const subscriptionInvoicesList = useSelector((state: SubscriptionInvoicesListState) => state.subscriptionInvoicesList)

    // state
    const [result, setResult] = useState<SubscriptionInvoice | null>(null)
    const [gettingResult, setGettingResult] = useState<boolean>(false)

    // adv mode
    const [cameraId, setCameraId] = useState<string | null>(null)
    const [startingScanner, setStartingScanner] = useState<boolean>(true)
    const [scanner, setScanner] = useState<any>(null)

    // modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = async () => {
        setResult(null)
        setStartingScanner(true)
        setCurrent(0)
        setCameraId(null)

        setIsModalOpen(false)
        if (scanner) {
            await scanner.stop()
            scanner.clear()
            setScanner(null)
        }
    }

    // check id
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)

    // get invoice
    const getInvoice = async (id: string) => {
        if (!isValidObjectId(id)) {
            messageApi.error({
                content: 'Invalid Invoice, try again'
            })
            return
        }

        try {
            setGettingResult(true)
            const { data } = await apiService.GET(`/subscription-invoice/${id}`, token)

            setResult(data)
            setCurrent(1)
            setTimeout(() => {
                setGettingResult(false)
            }, 500)
        } catch (error: any) {
            setGettingResult(false)
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    // useEffect(() => {
    //    if (isModalOpen) {
    //      // scanner
    //      const scanner = new Html5QrcodeScanner('subscriptionInvoiceReader',
    //      {
    //          qrbox: {
    //              width: 250,
    //              height: 250
    //          },
    //          fps: 5,
    //      },
    //      false, // verbose
    //  )

    //  const onSuccess = async (result: string) => {
    //      scanner.clear()

    //      console.log(result)
    //  }

    //  const onError = () => {

    //  }

    //  scanner.render(onSuccess, onError)
    //    }
    // }, [isModalOpen])

    useEffect(() => {
        if (isModalOpen) {
            Html5Qrcode.getCameras().then(devices => {
                if (devices && devices.length) {
                    var cameraId = devices[0].id;
                    setCameraId(cameraId)
                }
            }).catch(() => {
                // console.log('error')
                // handle err
            });
        } else {
            setCameraId(null)
        }
    }, [isModalOpen])

    useEffect(() => {
        if (cameraId && !result) {
            const html5QrCode = new Html5Qrcode('subscriptionInvoiceReader', false)
            setScanner(html5QrCode)

            html5QrCode.start(
                {
                    deviceId: { exact: cameraId },
                },
                {
                    fps: 3,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText) => {
                    if (decodedText) {
                        await getInvoice(decodedText)
                        await html5QrCode.stop()
                        html5QrCode.clear()
                    }
                },
                () => {
                    // console.log(errorMessage)
                })
        }
    }, [cameraId])

    useEffect(() => {
        if (cameraId && scanner) {
            setTimeout(() => {
                setStartingScanner(false)
            }, 1000)
        }
    }, [cameraId, scanner])

    // steps
    const [current, setCurrent] = useState(0);
    const steps = [
        {
            title: 'ScanQr',
            content: (
                <div
                    style={{
                        minHeight: '250px'
                    }}
                >
                    <div id='subscriptionInvoiceReader'></div>
                </div>
            ),
            status: result ? 'done' : 'process',
            icon: result ? <CheckOutlined style={{ color: 'green' }} /> : <LoadingOutlined />,
        },
        {
            title: 'Invoice Info',
            content: (
                <Spin spinning={gettingResult}>
                    {
                        result ?
                            <div
                                style={{
                                    minHeight: '250px',
                                    minWidth: '100%'
                                }}
                            >
                                <QrSubscriptionInvoiceInfo invoice={result} />
                            </div>
                            :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </Spin>
            )
        }
    ]

    const items: any = steps.map((item) => ({ key: item.title, title: item.title, icon: item.icon, status: item.status }));

    return (
        <>
            <Button
                style={{
                    marginBottom: '2em'
                }}
                type='primary'
                icon={<ScanOutlined />}
                onClick={showModal}
            >
                Scan QrCode
            </Button>

            <Modal
                title="Subscription Invoice Scanner"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                footer={
                    <Space>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>

                        {result &&
                            <PrintSubscriptionInvoice invoice={result} handleCancel={handleCancel}
                                subscriptionInvoicesList={subscriptionInvoicesList}
                            />
                        }
                    </Space>
                }
                width={!scanner && (xs || sm || md) ? 'auto' : result ? '50%' : '30%'}
            >
                <Spin spinning={startingScanner}
                >
                    <Steps current={current} items={items} />
                    <div
                        style={{
                            marginTop: '2em'
                        }}
                    >
                        {steps[current].content}
                    </div>
                </Spin>
            </Modal>
        </>
    )
}

export default SubscriptionInvoiceQrScanner