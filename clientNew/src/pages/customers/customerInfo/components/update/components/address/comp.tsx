import { Customer } from '@features/reducers/customers'
import { Location, LocationZone, LocationZoneStreet } from '@features/reducers/locations'
import { Col, Form, Input, Row, Select, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { FaRegBuilding } from 'react-icons/fa'
import { FaBuildingUser } from 'react-icons/fa6'
import { MdOutlineApartment } from 'react-icons/md'

type AddNewCustomerAddressSectionProps = {
    updatedInfo: Customer,
    setUpdatedInfo: (customerInfo: Customer) => void,
    activeLocationsList: Location[]
}

const UpdateCustomerAddressSection = ({
    activeLocationsList,
    updatedInfo,
    setUpdatedInfo
}: AddNewCustomerAddressSectionProps) => {
    const {
        address,
    } = updatedInfo

    // address
    const {
        building,
        floor,
        apartment
    } = address

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setUpdatedInfo({ ...updatedInfo, address: { ...address, [name]: value } })
    }

    const [selectedCity, setSelectedCity] = useState<any>([])
    const [selectedZone, setSelectedZone] = useState<any>([])
    const [selectedStreet, setSelectedStreet] = useState<any>([])

    const handleCityChange = (e: string) => {
        activeLocationsList.map((city) => {
            if (city._id === e) {
                setSelectedCity(city)
                setSelectedZone(city.zones[0])
                setSelectedStreet(city.zones[0].streets[0])

                setUpdatedInfo({
                    ...updatedInfo,
                    address: {
                        ...address,
                        city: city.city,
                        zone: city.zones[0].name,
                        street: city.zones[0].streets[0].name
                    }
                })
            }
        })
    }

    const handleZoneChange = (e: string) => {
        selectedCity.zones.map((zone: LocationZone) => {
            if (zone._id === e) {
                setSelectedZone(zone)
                setSelectedStreet(zone.streets[0])

                setUpdatedInfo({
                    ...updatedInfo,
                    address: {
                        ...address,
                        zone: zone.name,
                        street: zone.streets[0].name
                    }
                })
            }
        })
    }

    const handleStreetChange = (e: string) => {
        selectedCity.zones.map((zone: LocationZone) => {
            zone.streets.map((street) => {
                if (street._id === e) {
                    setSelectedStreet(street)

                    setUpdatedInfo({
                        ...updatedInfo,
                        address: {
                            ...address,
                            street: street.name
                        }
                    })
                }
            })
        })
    }

    useEffect(() => {
        if (activeLocationsList?.length > 0) {
            setSelectedCity(activeLocationsList[0])
            setSelectedZone(activeLocationsList[0].zones[0])
            setSelectedStreet(activeLocationsList[0].zones[0].streets[0])

            setUpdatedInfo({
                ...updatedInfo,
                address: {
                    ...address,
                    city: activeLocationsList[0].city,
                    zone: activeLocationsList[0].zones[0].name,
                    street: activeLocationsList[0].zones[0].streets[0].name,
                }
            })
        }
    }, [activeLocationsList])

    return (
<>
            <Form
                layout='vertical'
            >
                <Typography
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '0.5em'
                    }}
                >
                    Address
                </Typography>
                <Row gutter={[16, 0]}>
                    <Col>
                        <Form.Item
                            label='City'
                            required
                        >
                            <Select
                                onChange={handleCityChange}
                                optionLabelProp="label"
                                value={selectedCity ? selectedCity._id : ''}
                                style={{
                                    minWidth: '200px'
                                }}
                            >
                                {activeLocationsList && activeLocationsList.map((city: Location) => (
                                    <Select.Option key={city._id}
                                        label={city?.city}
                                        value={city?._id}
                                        name={'city'}
                                    >
                                        {city.city}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label='Zone'
                            required
                        >
                            <Select
                                onChange={handleZoneChange}
                                optionLabelProp="label"
                                value={selectedZone ? selectedZone?._id : ''}
                                style={{
                                    minWidth: '200px'
                                }}
                            >
                                {selectedCity?.zones?.length > 0 && selectedCity?.zones.map((zone: LocationZone) => (
                                    <Select.Option key={zone._id}
                                        label={zone?.name}
                                        value={zone?._id}
                                        name={'zone'}
                                    >
                                        {zone.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label='Street'
                            required
                        >
                            <Select
                                onChange={handleStreetChange}
                                optionLabelProp="label"
                                value={selectedStreet ? selectedStreet?._id : ''}
                                style={{
                                    minWidth: '200px'
                                }}
                            >
                                {selectedZone?.streets?.length > 0 && selectedZone?.streets?.map((street: LocationZoneStreet) => (
                                    <Select.Option key={street._id}
                                        label={street?.name}
                                        value={street?._id}
                                        name={'street'}
                                    >
                                        {street.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label='Building'
                            required
                        >
                            <Input
                                name='building'
                                value={building}
                                onChange={handleAddressChange}
                                placeholder='building'
                                prefix={<FaRegBuilding />}
                            />
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label='Floor'
                            required
                        >
                            <Input
                                name='floor'
                                value={floor}
                                onChange={handleAddressChange}
                                placeholder='floor'
                                prefix={<FaBuildingUser />}
                            />
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            label='Apartment'
                            required
                        >
                            <Input
                                name='apartment'
                                value={apartment}
                                onChange={handleAddressChange}
                                placeholder='apartment'
                                prefix={<MdOutlineApartment />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default UpdateCustomerAddressSection