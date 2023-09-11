import { PlusOutlined } from '@ant-design/icons'
import { CustomerListState } from '@features/reducers/customers'
import { TokenState } from '@features/reducers/token'
import { useSocket } from '@socket/provider/socketProvider'
import {
    App,
    Button,
    Divider,
    Modal,
    Spin,
} from 'antd'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useWindowDimensions } from '@hooks/useWindowDimensions'
import AddNewCustomerMainSection from './components/main/comp'
import { AddNewCustomerAddressSection } from './components/address'
import apiService from '@api/index'
import { AuthState } from '@features/reducers/auth'
import { Location } from '@features/reducers/locations'
import AddNewCustomerMoreInfoSection from './components/moreInfo/comp'
import { checkWhiteSpaces, isLessThan } from '@utils/stringCheck'
import { isValidCoordinates, isValidIPAddress, isValidMACAddress, isValidPhoneNumber } from '@utils/patterns'
import { dispatchGetCustomers } from '@features/actions/customers'
import { handleCapitalizedValues } from '@utils/strings'
import { dispatchGetActiveInternetServices, fetchActiveInternetServices } from '@features/actions/internetServices'
import { InternetService } from '@features/reducers/internetServices'
import { ActiveInternetServiceListState } from '@features/reducers/internetServices/active'

type AddressProps = {
    city: string,
    zone: string,
    street: string,
    building: string,
    floor: string,
    apartment: string
}

type CoordinatesProps = {
    latitude: string,
    longitude: string
}

export type InitialStateProps = {
    fullName: string,
    arabicName: string,
    phoneNumber: string,
    coordinates: CoordinatesProps,
    macAddress: string,
    ipAddress: string,
    subscriptionDate: Date,
    address: AddressProps,
    moreInfo: string,
    service: string,
    accountName: string,
}

const initialState: InitialStateProps = {
    fullName: '',
    arabicName: '',
    phoneNumber: '',
    coordinates: {
        latitude: '',
        longitude: ''
    },
    macAddress: '',
    ipAddress: '',
    subscriptionDate: new Date(),
    address: {
        city: '',
        zone: '',
        street: '',
        building: '',
        floor: '',
        apartment: ''
    },
    moreInfo: '',
    service: '',
    accountName: ''
}

type AddNewCustomerProps = {
    activeLocationsList: Location[]
}

type PhoneNumber = {
    key: number,
    number: string
}

const AddNewCustomer = ({ activeLocationsList }: AddNewCustomerProps) => {
    const token = useSelector((state: TokenState) => state.token)
    const { message: messageApi } = App.useApp()
    const { socketProvider } = useSocket()
    const dispatch = useDispatch()
    const customersList = useSelector((state: CustomerListState) => state.customersList)
    const { user: currentUser } = useSelector((state: AuthState) => state.auth)
    const { screenSizes } = useWindowDimensions()
    const { xs, sm, md } = screenSizes
    const activeInternetServicesList = useSelector((state: ActiveInternetServiceListState) => state.activeInternetServicesList)

    useEffect(() => {
        fetchActiveInternetServices(token).then((res: InternetService[]) => {
            dispatch(dispatchGetActiveInternetServices(res))
        })
    }, [])

    // modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    // state
    const [adding, setAdding] = useState<boolean>(false)

    // customer info
    const [customerInfo, setCustomerInfo] = useState<InitialStateProps>(initialState)
    const [uploadedFile, setUploadedFile] = useState<any>()
    // phone numbers
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])

    const {
        fullName,
        arabicName,
        phoneNumber,
        coordinates,
        macAddress,
        ipAddress,
        subscriptionDate,
        address,
        moreInfo,
        service,
        accountName
    } = customerInfo

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
            setCustomerInfo({ ...customerInfo, [name]: newValue })
        } else {
            setCustomerInfo({ ...customerInfo, [name]: value })
        }
    }

    const handleErrors = (error: string) => {
        messageApi.open({
            type: 'error',
            content: error,
            duration: 2
        })
    }

    const handleAddCustomer = async () => {
        // building pic
        const formData = new FormData()
        formData.append('image', uploadedFile)

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

        // subscriptionDate
        const epochStartTime = new Date('Thu Jan 01 1970 02:00:00 GMT+0200');
        if (subscriptionDate.getTime() === epochStartTime.getTime()) {
            handleErrors('Please add a subscription date');
            return;
        }

        // moreInfo
        if (moreInfo.length > 1200) {
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

        const params = {
            fullName,
            arabicName,
            phoneNumber,
            coordinates,
            macAddress,
            ipAddress,
            subscriptionDate,
            address,
            moreInfo,
            service,
            accountName,
            additionalPhoneNumbers: updatedPhoneNumbers
        }

        try {
            setAdding(true)

            const { data } = await apiService.POSTWithParams(`/customer`, formData, params, token)

            const { message, result } = data
            messageApi.open({
                type: 'success',
                content: message,
                duration: 2
            })

            if (result) {
                const updatedList = [result, ...customersList]
                dispatch(dispatchGetCustomers(updatedList))
            }

            socketProvider.emit('getCustomers_to_server', { userId: currentUser?._id })

            setAdding(false)
            setUploadedFile(null)
            setCustomerInfo(initialState)
            setPhoneNumbers([])
            handleCancel()
        } catch (error: any) {
            setAdding(false)
            messageApi.open({
                type: 'error',
                content: error?.response?.data?.message,
                duration: 4
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
                Add New Customer
            </Button>

            <Modal
                title="Add New Customer"
                open={isModalOpen}
                onOk={handleAddCustomer}
                onCancel={handleCancel}
                centered={xs || sm || md ? false : true}
                confirmLoading={adding}
                okText='Save Customer'
                width={xs || sm || md ? 'auto' : '50%'}
            >
                <Spin spinning={adding}>
                    <div
                        style={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            maxHeight: xs || sm || md ? '700px' : '750px'
                        }}
                    >
                        <AddNewCustomerMainSection
                            handleInputChange={handleInputChange}
                            customerInfo={customerInfo}
                            setCustomerInfo={setCustomerInfo}
                            activeInternetServicesList={activeInternetServicesList}
                        />

                        <Divider />

                        <AddNewCustomerAddressSection
                            customerInfo={customerInfo}
                            setCustomerInfo={setCustomerInfo}
                            setUploadedFile={setUploadedFile}
                            uploadedFile={uploadedFile}
                            activeLocationsList={activeLocationsList}
                        />

                        <Divider />

                        <AddNewCustomerMoreInfoSection
                            moreInfo={moreInfo}
                            handleInputChange={handleInputChange}
                            setPhoneNumbers={setPhoneNumbers}
                            phoneNumbers={phoneNumbers}
                        />
                    </div>
                </Spin>
            </Modal>
        </>
    )
}

export default AddNewCustomer