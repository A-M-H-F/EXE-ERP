import { BorderlessTableOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Button, Form, Input, Modal, Space, Spin } from 'antd'
import { useState, useEffect } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { dispatchGetISP, fetchISP } from '@features/actions/isp'
import { ISP, ISPListState } from '@features/reducers/isp'
import { checkLength, checkWhiteSpaces } from '@utils/stringCheck'

type InitialStateProps = {
    name: string,
    address: string,
    contactInfo: string,
    code: number,
}

const initialState: InitialStateProps = {
    name: '',
    address: '',
    contactInfo: '',
    code: 0,
}

interface PhoneNumber {
    key: number;
    number: string;
}

const AddNewIsp = () => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const ispList = useSelector((state: ISPListState) => state.ispList)

    useEffect(() => {
        fetchISP(token).then((res: ISP[]) => {
            dispatch(dispatchGetISP(res))
        })
    }, [])

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // loading
    const [adding, setAdding] = useState<boolean>(false)

    // state
    const [ispInfo, setIspInfo] = useState<InitialStateProps>(initialState)
    const { name, address, contactInfo, code } = ispInfo

    const handleInputChange = (e: any) => {
        const { name, value } = e.target

        setIspInfo({ ...ispInfo, [name]: String(value) })
    }

    // phone numbers
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([{ key: 0, number: '' }]);

    const onAddPhone = () => {
        const newKey = phoneNumbers.length;
        setPhoneNumbers([...phoneNumbers, { key: newKey, number: '' }]);
    }

    const onChangeNumber = (newNumber: any, index: number) => {
        const updatedNumbers = phoneNumbers.map(phone => {
            if (phone.key === index) {
                return { ...phone, number: newNumber }
            }
            return phone
        })
        setPhoneNumbers(updatedNumbers);
    }

    const onRemovePhone = (index: number) => {
        const updatedNumbers = phoneNumbers.filter(phone => phone.key !== index);

        const keyUpdated = [...updatedNumbers].map((phone, index) => (
            {
                key: index,
                number: phone.number
            }
        ))

        setPhoneNumbers(keyUpdated);
    }

    const handleAddIsp = async () => {
        if (phoneNumbers?.length <= 0) {
            messageApi.open({
                type: 'error',
                content: 'Please add at least 1 phone number',
                duration: 2
            })
            return
        }
        const checkPhones = phoneNumbers.some((phone) => checkWhiteSpaces(phone.number))
        if (checkPhones) {
            messageApi.open({
                type: 'error',
                content: 'Please check phone numbers, some contain only whitespace',
                duration: 2
            })
            return
        }

        const updatedPhoneNumbers = phoneNumbers.map((phone) => phone.number)

        // name
        const nameWhiteSpaceCheck = checkWhiteSpaces(name)
        const nameLength = checkLength(name, 3)
        if (nameWhiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Name should not contain only whitespace'
            })
            return
        }
        if (nameLength) {
            messageApi.open({
                type: 'error',
                content: 'Name must be at least 4 characters long'
            })
            return
        }

        // address
        const whiteSpaceCheck = checkWhiteSpaces(address)
        const addressLength = checkLength(name, 3)
        if (whiteSpaceCheck) {
            messageApi.open({
                type: 'error',
                content: 'Address should not contain only whitespace'
            })
            return
        }
        if (addressLength) {
            messageApi.open({
                type: 'error',
                content: 'Address must be at least 6 characters long'
            })
            return
        }

        if (!code) {
            messageApi.error({
                content: 'Please add a company code',
                duration: 2
            })
            return;
        }

        const body = {
            name,
            address,
            phoneNumbers: updatedPhoneNumbers,
            contactInfo,
            code,
        }

        try {
            setAdding(true)

            const { data } = await apiService.POST('/isp', body, token)

            const { message, result } = data

            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            socketProvider.emit('getAllIsp_to_server', { userId: currentUser?._id })

            const updatedList = [...ispList, result]
            dispatch(dispatchGetISP(updatedList))

            setIspInfo(initialState)
            setPhoneNumbers([{ key: 0, number: '' }])
            handleCancel()
            setAdding(false)
        } catch (error: any) {
            setAdding(false)
            messageApi.open({
                type: 'error',
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
                Add New ISP
            </Button>

            <Modal
                title="Add New ISP"
                open={isModalOpen}
                onOk={handleAddIsp}
                onCancel={handleCancel}
                centered
                confirmLoading={adding}
                okText='Save ISP'
            >
                <Form
                    layout='vertical'
                    onFinish={handleAddIsp}
                >
                    <Spin spinning={adding}>
                        <Form.Item
                            label='Name'
                            required
                        >
                            <Input
                                name='name'
                                value={name}
                                onChange={handleInputChange}
                                placeholder='ISP name'
                                prefix={<HiOutlineOfficeBuilding />}
                            />
                        </Form.Item>

                        <Form.Item
                            label='Address'
                            required
                        >
                            <Input
                                prefix={<CiLocationOn />}
                                name='address'
                                value={address}
                                onChange={handleInputChange}
                                placeholder='ISP address'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Code'
                            required
                        >
                            <Input
                                prefix={<BorderlessTableOutlined />}
                                name='code'
                                type='number'
                                min={0}
                                value={code}
                                onChange={handleInputChange}
                                placeholder='ISP Code'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Contact Info'
                        >
                            <Input
                                prefix={<UserOutlined />}
                                name='contactInfo'
                                value={contactInfo}
                                onChange={handleInputChange}
                                placeholder='ISP contact info/user'
                            />
                        </Form.Item>

                        <Form.Item
                            label='Phone Numbers'
                            required
                        >
                            {phoneNumbers.map((phone: PhoneNumber, index: number) => (
                                <Space
                                    key={phone.key}
                                    style={{ display: 'flex', marginBottom: 8 }}
                                    align="baseline"
                                >
                                    <Input
                                        value={phone.number}
                                        onChange={(e: any) => onChangeNumber(e.target.value, index)}
                                        prefix={<PhoneOutlined />}
                                        placeholder='+000 / 00-000-000'
                                    />

                                    {phoneNumbers.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => onRemovePhone(phone.key)}
                                        />
                                    ) : null}
                                </Space>
                            ))}
                        </Form.Item>

                        <Form.Item>
                            <Button type="dashed" onClick={onAddPhone} block icon={<PlusOutlined />}>
                                Add Phone Number
                            </Button>
                        </Form.Item>
                    </Spin>
                </Form>
            </Modal>
        </>
    )
}

export default AddNewIsp