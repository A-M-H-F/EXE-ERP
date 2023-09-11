import { BorderlessTableOutlined, PhoneOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons'
import { Customer } from '@features/reducers/customers'
import { InternetService } from '@features/reducers/internetServices'
import { Col, Form, Input, Row, Select, Space } from 'antd'
import React from 'react'
import { HiMiniAtSymbol } from 'react-icons/hi2'
import { TbWorldLatitude, TbWorldLongitude } from 'react-icons/tb'

type UpdateCustomerMainSectionProps = {
    updatedInfo: Customer,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setUpdatedInfo: (customerInfo: Customer) => void,
    activeInternetServicesList: InternetService[]
}

const UpdateCustomerMainSection = ({
    updatedInfo, handleInputChange, setUpdatedInfo, activeInternetServicesList }: UpdateCustomerMainSectionProps) => {
    const {
        fullName,
        arabicName,
        phoneNumber,
        coordinates,
        macAddress,
        ipAddress,
        service,
        accountName
    } = updatedInfo

    // coordinates
    const {
        latitude,
        longitude
    } = coordinates


    const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setUpdatedInfo({ ...updatedInfo, coordinates: { ...coordinates, [name]: value } })
    }

    const handleServiceChange = (e: string) => {
        activeInternetServicesList.map((service) => {
            if (service._id === e) {
                setUpdatedInfo({ ...updatedInfo, service: { _id: e, service: service.service } })
            }
        })
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
                        label='Internet service'
                    >
                        <Select
                            onChange={handleServiceChange}
                            style={{
                                minWidth: '100%'
                            }}
                            value={service ? service._id : 'Select Service'}
                            optionLabelProp='label'
                            showSearch
                            filterOption={(input: string, option: any) =>
                                (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {activeInternetServicesList && activeInternetServicesList?.map((service) => (
                                <Select.Option
                                    key={service._id}
                                    value={service._id}
                                    label={service.service}
                                >
                                    {service.service}
                                </Select.Option>
                            ))}
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

export default UpdateCustomerMainSection