import React from 'react'
import { InitialStateProps } from '../../comp'
import { Col, DatePicker, Form, Input, Row, Select, Space } from 'antd'
import { BorderlessTableOutlined, PhoneOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { HiMiniAtSymbol } from 'react-icons/hi2'
import { TbWorldLatitude, TbWorldLongitude } from 'react-icons/tb'
import { InternetService } from '@features/reducers/internetServices'

type AddNewCustomerMainSectionProps = {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    customerInfo: InitialStateProps,
    setCustomerInfo: (customerInfo: InitialStateProps) => void,
    activeInternetServicesList: InternetService[]
}

const AddNewCustomerMainSection = ({
    handleInputChange,
    customerInfo,
    setCustomerInfo,
    activeInternetServicesList
}: AddNewCustomerMainSectionProps) => {
    const {
        fullName,
        arabicName,
        phoneNumber,
        coordinates,
        macAddress,
        ipAddress,
        service,
        accountName
    } = customerInfo

    // coordinates
    const {
        latitude,
        longitude
    } = coordinates

    const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setCustomerInfo({ ...customerInfo, coordinates: { ...coordinates, [name]: value } })
    }

    const onChangeDate = (dateString: string) => {
        const selectedDate = new Date(dateString);
        setCustomerInfo({ ...customerInfo, ['subscriptionDate']: selectedDate })
    }

    const range = (start: number, end: number) => {
        const result = []
        for (let i = start; i < end; i++) {
            result.push(i)
        }
        return result
    }
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Get the date from 2 days ago
        const twoDaysAgo = dayjs().subtract(2, 'day').endOf('day');

        // Disable dates before 2 days ago
        return current && current < twoDaysAgo;

        // yesterday only
        // Get yesterday's date
        // const yesterday = dayjs().subtract(1, 'day').endOf('day');

        // // Disable dates before yesterday
        // return current && current < yesterday;
    }
    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    })

    const handleServiceChange = (e: string) => {
        if (e) {
            setCustomerInfo({ ...customerInfo, ['service']: e })
        } else {
            setCustomerInfo({ ...customerInfo, ['service']: '' })
        }
    }

    return (
        <Form
            layout='vertical'
            style={{
                marginTop: '2em'
            }}
        >
            <Row gutter={[16, 0]}>
                <Col>
                    <Form.Item
                        label='Full Name'
                        required
                    >
                        <Input
                            name='fullName'
                            value={fullName}
                            onChange={handleInputChange}
                            placeholder='Full name'
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='Full Name In Arabic'
                        required
                    >
                        <Input
                            name='arabicName'
                            value={arabicName}
                            onChange={handleInputChange}
                            placeholder='Full name in arabic'
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='Phone Number'
                        required
                    >
                        <Input
                            name='phoneNumber'
                            value={phoneNumber}
                            onChange={handleInputChange}
                            placeholder='phone number'
                            prefix={<PhoneOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='Subscription Date'
                        required
                    >
                        <DatePicker
                            onChange={(e: any) => onChangeDate(e)}
                            format="DD-MM-YYYY HH:mm:ss"
                            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            defaultValue={dayjs()}
                        />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='Mac Address'
                        required
                    >
                        <Input
                            name='macAddress'
                            value={macAddress}
                            onChange={handleInputChange}
                            placeholder='1A:2B:3C:4D:5E:6F'
                            prefix={<HiMiniAtSymbol />}
                        />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='IP Address'
                        required
                    >
                        <Input
                            name='ipAddress'
                            value={ipAddress}
                            onChange={handleInputChange}
                            placeholder='0.0.0.0'
                            prefix={<WifiOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='Coordinates'
                    >
                        <Space.Compact>
                            <Input
                                name='latitude'
                                value={latitude}
                                onChange={handleCoordinatesChange}
                                placeholder='latitude: -37.123456'
                                prefix={<TbWorldLatitude />}
                            />
                            <Input
                                name='longitude'
                                value={longitude}
                                onChange={handleCoordinatesChange}
                                placeholder='longitude: 145.789012'
                                prefix={<TbWorldLongitude />}
                            />
                        </Space.Compact>
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item
                        label='Internet Service (optional)'
                    >
                        <Select
                            onChange={handleServiceChange}
                            style={{
                                minWidth: '100%'
                            }}
                            placeholder='Select Service'
                            allowClear
                            value={service || undefined}
                        >
                            {activeInternetServicesList && activeInternetServicesList?.length > 0
                                ?
                                activeInternetServicesList.map((option) => (
                                    <Select.Option
                                        value={option._id}
                                        label={option.service}
                                        name='service'
                                        key={option._id}
                                    >
                                        {option.service}
                                    </Select.Option>
                                ))
                                : null
                            }
                        </Select>
                    </Form.Item>
                </Col>

                {service &&
                    <Col>
                        <Form.Item label='Account Name'>
                            <Input
                                value={accountName}
                                onChange={handleInputChange}
                                name='accountName'
                                placeholder='Account Name'
                                prefix={<BorderlessTableOutlined />}
                            />
                        </Form.Item>
                    </Col>
                }
            </Row>
        </Form>
    )
}

export default AddNewCustomerMainSection