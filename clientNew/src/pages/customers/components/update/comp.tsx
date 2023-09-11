import { EditOutlined } from '@ant-design/icons'
import { AuthState } from '@features/reducers/auth'
import { Customer } from '@features/reducers/customers'
import { TokenState } from '@features/reducers/token'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import { useSocket } from '@socket/provider/socketProvider'
import { App, Divider, Modal, Spin, Tooltip } from 'antd'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { UpdateCustomerMainSection } from './components/main'
import UpdateCustomerAddressSection from './components/address/comp'
import { Location } from '@features/reducers/locations'
import UpdateCustomerMoreInfoSection from './components/moreInfo/comp'
import { checkWhiteSpaces, isLessThan } from '@utils/stringCheck'
import { isValidCoordinates, isValidIPAddress, isValidMACAddress, isValidPhoneNumber } from '@utils/patterns'
import apiService from '@api/index'
import { dispatchGetCustomers } from '@features/actions/customers'
import { handleCapitalizedValues } from '@utils/strings'
import { InternetService } from '@features/reducers/internetServices'

type PhoneNumber = {
    key: number,
    number: string
}

type UpdateCustomerInfoProps = {
    customerInfo: Customer,
    customersList: Customer[],
    activeLocationsList: Location[],
    activeInternetServicesList: InternetService[]
}

const UpdateCustomerInfo = ({ customerInfo, customersList, activeLocationsList, activeInternetServicesList }: UpdateCustomerInfoProps) => {
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes

    const initialState = {
        ...customerInfo,
    }

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setLoading(false)
        setIsModalOpen(false)
    }

    // r states
    const token = useSelector((state: TokenState) => state.token)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const { message: messageApi } = App.useApp()

    // state
    const [loading, setLoading] = useState<boolean>(true)
    const [updating, setUpdating] = useState<boolean>(false)
    const [updatedInfo, setUpdatedInfo] = useState<Customer>(initialState)

    // phone numbers
    const roundedPhones: PhoneNumber[] | any = initialState?.additionalPhoneNumbers?.map((number, index) => (
        {
            key: index,
            number: number
        }
    ))
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(roundedPhones)

    const {
        fullName,
        arabicName,
        phoneNumber,
        coordinates,
        macAddress,
        ipAddress,
        address,
        moreInfo,
        service,
        accountName
    } = updatedInfo

    const {
        city,
        zone,
        street,
        building,
        floor,
        apartment
    } = address

    // events
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name === 'fullName') {
            const newValue = handleCapitalizedValues(value)
            setUpdatedInfo({ ...updatedInfo, [name]: newValue })
        } else {
            setUpdatedInfo({ ...updatedInfo, [name]: value })
        }
    }

    const handleErrors = (error: string) => {
        messageApi.open({
            type: 'error',
            content: error,
            duration: 2
        })
    }

    const handleUpdateEvent = async () => {
        // phone numbers
        if (phoneNumbers?.length > 0) {
            const length = phoneNumbers.some((phone) => isLessThan(phone.number.length, 8))
            if (length) {
                handleErrors('Phone number be at least 8 numbers long, check the list')
                return;
            }

            const validation = phoneNumbers.some((phone) => isValidPhoneNumber(phone.number))
            if (!validation) {
                handleErrors('Invalid phone number format, check the list');
                return;
            }
        }
        const updatedPhoneNumbers = phoneNumbers.map((phone) => phone.number)

        // names
        const nameWhitespace = checkWhiteSpaces(fullName)
        const arabicNameWhitespace = checkWhiteSpaces(arabicName)
        if (nameWhitespace) {
            handleErrors('Name should not contain only whitespace')
            return
        }
        if (arabicNameWhitespace) {
            handleErrors('Arabic name should not contain only whitespace')
            return
        }
        const nameLength = isLessThan(fullName.length, 3)
        const arabicNameLength = isLessThan(arabicName.length, 3)
        if (nameLength) {
            handleErrors('Name must be at least 3 characters long')
            return
        }
        if (arabicNameLength) {
            handleErrors('Arabic name must be at least 3 characters long')
            return
        }

        // phone number
        if (!isValidPhoneNumber(phoneNumber)) {
            handleErrors('Invalid phone number format');
            return;
        }
        const phoneNumberLength = isLessThan(phoneNumber.length, 8)
        if (phoneNumberLength) {
            handleErrors('Phone number be at least 8 numbers long')
            return
        }

        // coordinates
        if (coordinates.longitude.length > 0) {
            if (!isValidCoordinates(coordinates.longitude)) {
                handleErrors('Invalid longitude format')
                return
            }
        }
        if (coordinates.latitude.length > 0) {
            if (!isValidCoordinates(coordinates.latitude)) {
                handleErrors('Invalid latitude format')
                return
            }
        }

        // macAddress
        if (!isValidMACAddress(macAddress)) {
            handleErrors('Invalid mac address format')
            return
        }

        // ipAddress
        if (!isValidIPAddress(ipAddress)) {
            handleErrors('Invalid ip address format')
            return
        }

        // moreInfo
        if (moreInfo && moreInfo?.length > 1200) {
            handleErrors('Please write a short more info text')
            return
        }

        // address
        if (
            checkWhiteSpaces(city) || checkWhiteSpaces(zone) || checkWhiteSpaces(building)
            || checkWhiteSpaces(street) || checkWhiteSpaces(apartment) || checkWhiteSpaces(floor)
        ) {
            handleErrors('Please check customer address')
            return
        }

        const body = {
            fullName,
            arabicName,
            phoneNumber,
            coordinates,
            macAddress,
            ipAddress,
            address,
            moreInfo,
            accountName,
            service: service?._id,
            additionalPhoneNumbers: updatedPhoneNumbers
        }

        try {
            setUpdating(true)

            const { data } = await apiService.PUT(`/customer/${customerInfo._id}`, body, token)

            const { message, result } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            if (result) {
                const updatedList = customersList.map((customer) => {
                    if (customer._id === customerInfo._id) {
                        return { ...result }
                    }
                    return customer
                })
                dispatch(dispatchGetCustomers(updatedList))
            }

            socketProvider.emit('getCustomers_to_server', { userId: currentUser?._id })
            socketProvider.emit('getCustomer_to_server', { customer: customerInfo?._id })

            setUpdating(false)
            setPhoneNumbers([])
            handleCancel()
        } catch (error: any) {
            setUpdating(false)
            messageApi.open({
                type: 'error',
                content: error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        setUpdatedInfo(initialState)
    }, [customerInfo])

    useEffect(() => {
        if (isModalOpen) {
            setLoading(true)
        }

        setTimeout(() => {
            setLoading(false)
        }, 800)
    }, [isModalOpen])

    return (
        <>
            <Tooltip title='Update Customer Info'>
                <EditOutlined
                    onClick={showModal}
                />
            </Tooltip>

            <Modal
                title="Update Customer Info"
                open={isModalOpen}
                onOk={handleUpdateEvent}
                onCancel={handleCancel}
                centered={xs || sm || md ? false : true}
                confirmLoading={updating}
                okText='Update Customer'
                maskClosable={false}
                width={xs || sm || md ? 'auto' : '50%'}
            >
                <Spin spinning={updating || loading}>
                    <div
                        style={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            maxHeight: xs || sm || md ? '700px' : '750px'
                        }}
                    >
                        <UpdateCustomerMainSection
                            updatedInfo={updatedInfo}
                            handleInputChange={handleInputChange}
                            setUpdatedInfo={setUpdatedInfo}
                            activeInternetServicesList={activeInternetServicesList}
                        />

                        <Divider />

                        <UpdateCustomerAddressSection
                            activeLocationsList={activeLocationsList}
                            updatedInfo={updatedInfo}
                            setUpdatedInfo={setUpdatedInfo}
                        />

                        <Divider />

                        <UpdateCustomerMoreInfoSection
                            phoneNumbers={phoneNumbers}
                            setPhoneNumbers={setPhoneNumbers}
                            moreInfo={moreInfo}
                            handleInputChange={handleInputChange}
                        />
                    </div>
                </Spin>
            </Modal>
        </>
    )
}

export default UpdateCustomerInfo