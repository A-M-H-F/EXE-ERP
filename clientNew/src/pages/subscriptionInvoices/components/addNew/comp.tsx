import { PlusOutlined } from '@ant-design/icons'
import apiService from '@api/index'
import { dispatchGetActiveCustomers, fetchActiveCustomers } from '@features/actions/customers'
import { dispatchGetSubscriptionsInvoices } from '@features/actions/subscriptionInvoices'
import { AuthState } from '@features/reducers/auth'
import { Customer } from '@features/reducers/customers'
import { ActiveCustomersListState } from '@features/reducers/customers/active'
import { SubscriptionInvoice, SubscriptionInvoicesListState } from '@features/reducers/subscriptionInvoices'
import { TokenState } from '@features/reducers/token'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Badge, Button, DatePicker, Divider, Form, Modal, Select, Space, Spin, Steps } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { PrintSubscriptionInvoice } from '../print'

const paymentStatusOptions = [
    {
        text: 'Paid',
        value: 'paid'
    },
    {
        text: 'Not Paid | To be paid',
        value: 'unPaid'
    }
]

const getCurrentMonth = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear()

    const formattedDate = `${month}/${year}`

    return formattedDate
}

type InitialStateProps = {
    customer: string,
    invoiceMonth: string,
    paymentStatus: string,
    paymentDate: Date,
    invoiceDate: Date,
}

const initialState: InitialStateProps = {
    customer: '',
    invoiceMonth: getCurrentMonth(),
    paymentStatus: 'unPaid',
    paymentDate: new Date(),
    invoiceDate: new Date(),
}

const AddNewSubscriptionInvoice = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const subscriptionInvoicesList = useSelector((state: SubscriptionInvoicesListState) => state.subscriptionInvoicesList)
    const activeCustomersList = useSelector((state: ActiveCustomersListState) => state.activeCustomersList)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes

    useEffect(() => {
        fetchActiveCustomers(token).then((res: Customer[]) => {
            dispatch(dispatchGetActiveCustomers(res))
        })
    }, [])


    // modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setCurrent(0)
        setIsModalOpen(false)
        setNewResult(null)
    }

    // state
    const [adding, setAdding] = useState<boolean>(false)
    const [newResult, setNewResult] = useState<SubscriptionInvoice | null>(null)

    // info state
    const [info, setInfo] = useState<InitialStateProps>(initialState)
    const { customer, invoiceMonth, paymentStatus, paymentDate } = info

    // events
    const handleCustomerChange = (value: string) => {
        if (!value) {
            setInfo({ ...info, customer: '' })
        } else {
            setInfo({ ...info, customer: value })
        }
    }

    const handleInvoiceMonthChange = (dateString: any) => {
        if (dateString) {
            const date = dateString?.$d
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear()

            const formattedDate = `${month}/${year}`

            setInfo({ ...info, invoiceMonth: formattedDate, invoiceDate: new Date(dateString) })
        } else {
            setInfo({ ...info, invoiceMonth: '' })
        }
    }

    const handlePaymentStatusChange = (value: string) => {
        setInfo({ ...info, paymentStatus: value })
    }

    const handlePaymentDateChange = (value: any) => {
        const date = new Date(value)
        const epochStartTime = new Date('Thu Jan 01 1970 02:00:00 GMT+0200')

        if (date.getTime() === epochStartTime.getTime()) {
            setInfo({ ...info, paymentDate: new Date() })
        } else {
            setInfo({ ...info, paymentDate: date })
        }
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Disable dates before the start of the current year
        return current && current < dayjs().startOf('year');
    }

    const steps = [
        {
            title: 'Add Invoice',
            content: (
                <Form
                    layout='vertical'
                    style={{
                        marginTop: '1em'
                    }}
                >
                    <Form.Item
                        label='Customer'
                        required
                    >
                        <Select
                            onChange={handleCustomerChange}
                            optionLabelProp='label'
                            showSearch
                            filterOption={
                                (input: string, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())
                            }
                            value={customer ? customer : 'Select Customer'}
                            allowClear
                        >
                            {activeCustomersList && activeCustomersList?.map((customer) => (
                                <Select.Option
                                    key={customer._id}
                                    label={`${customer.fullName} | ${customer.arabicName}`}
                                    value={customer._id}
                                >
                                    <Space>
                                        {customer.fullName}
                                        <Divider type='vertical' />
                                        {customer.arabicName}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label='Invoice Month'
                        required
                    >
                        <DatePicker
                            onChange={handleInvoiceMonthChange}
                            picker="month"
                            format={'MM/YYYY'}
                            defaultValue={dayjs(new Date())}
                            disabledDate={disabledDate}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Payment Status'
                        required
                    >
                        <Badge.Ribbon
                            text={paymentStatus === 'paid' ? 'Paid' : 'Not Paid'}
                            color={paymentStatus === 'paid' ? 'green' : 'red'}
                        >
                            <Select
                                onChange={handlePaymentStatusChange}
                                optionLabelProp='label'
                                value={paymentStatus}
                            >
                                {paymentStatusOptions.map((option) => (
                                    <Select.Option
                                        key={option.value}
                                        value={option.value}
                                        label={option.text}
                                    >
                                        {option.text}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Badge.Ribbon>

                    </Form.Item>

                    {paymentStatus === 'paid' &&
                        <>
                            <Form.Item
                                label='Payment Date'
                                required
                            >
                                <DatePicker
                                    onChange={handlePaymentDateChange}
                                    value={dayjs(paymentDate)}
                                    format={'DD/MM/YYYY'}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>

                            {/* To add a collector */}
                        </>
                    }
                </Form>
            )
        },
        {
            title: 'Print Invoice',
            content: '',
        }
    ]
    const items = steps.map((item) => ({ key: item.title, title: item.title }))
    const [current, setCurrent] = useState(0);

    const handleAddInvoice = async () => {
        // payment date
        const epochStartTime = new Date('Thu Jan 01 1970 02:00:00 GMT+0200')
        if (paymentStatus === 'paid') {
            if (!paymentDate || paymentDate.getTime() === epochStartTime.getTime()) {
                messageApi.error({
                    content: 'Please add a payment date',
                    duration: 2
                })
                return;
            }
        }

        // customer
        if (!customer) {
            messageApi.error({
                content: 'Please select a customer',
                duration: 2
            })
            return
        }

        // invoice month
        if (!invoiceMonth) {
            messageApi.error({
                content: 'Please select invoice month',
                duration: 2
            })
            return
        }

        const body = {
            ...info
        }

        try {
            setAdding(true)
            const { data } = await apiService.POST('/subscription-invoice', body, token)

            const { message, result } = data

            messageApi.success({
                content: message,
                duration: 2
            })

            if (result) {
                setNewResult(result)
                const updatedList = [result, ...subscriptionInvoicesList]
                dispatch(dispatchGetSubscriptionsInvoices(updatedList))
            }

            socketProvider.emit('getSubscriptionInvoices_to_server', { userId: currentUser?._id })

            setInfo(initialState)
            setAdding(false)
            setCurrent(1)
        } catch (error: any) {
            setAdding(false)
            messageApi.error({
                content: error?.response?.data?.message
            })
        }
    }

    return (
        <>
            <Button
                type='primary'
                style={{
                    marginBottom: '2em'
                }}
                icon={<PlusOutlined />}
                onClick={showModal}
            >
                Add New Invoice
            </Button>

            <Modal
                title="Add New Invoice"
                open={isModalOpen}
                onCancel={handleCancel}
                centered={xs || sm || md ? false : true}
                confirmLoading={adding}
                okText='Save Invoice'
                maskClosable={false}
                footer={<></>}
            >
                <Spin spinning={adding}>
                    <Steps current={current} items={items} />

                    <div>{steps[current].content}</div>

                    <div style={{ marginTop: 24 }}>
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={handleAddInvoice}
                                disabled={adding}
                            >
                                Save Invoice
                            </Button>
                        )}
                    </div>

                    <div>
                        {current === steps.length - 1 && newResult &&
                            <PrintSubscriptionInvoice
                                invoice={newResult}
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

export default AddNewSubscriptionInvoice