import React, { useState } from 'react'
import { InitialStateProps } from '../../comp'
import { Col, Form, Input, Row, Typography, message as messageApiUp, Upload, Modal, Select } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { UploadProps } from 'antd/lib'
import { Location, LocationZone, LocationZoneStreet } from '@features/reducers/locations'
import { FaRegBuilding } from 'react-icons/fa'
import { FaBuildingUser } from 'react-icons/fa6'
import { MdOutlineApartment } from 'react-icons/md'

const { Dragger } = Upload

type AddNewCustomerAddressSectionProps = {
    customerInfo: InitialStateProps,
    setCustomerInfo: (customerInfo: InitialStateProps) => void,
    setUploadedFile: (e: any) => void,
    uploadedFile: any,
    activeLocationsList: Location[]
}

const beforeUpload = (file: RcFile) => {
    const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png'
        || file.type === 'image/webp' || file.type === 'image/jpg'
    if (!isJpgOrPngOrWebp) {
        messageApiUp.open({
            type: 'error',
            content: 'You can only upload JPG/PNG/WEBP file!'
        })
    }
    const isLt2M = file.size < 2 * 1024 * 1024
    if (!isLt2M) {
        messageApiUp.open({
            type: 'error',
            content: 'Image must smaller than 2MB!'
        })
    }
    return isJpgOrPngOrWebp && isLt2M
}

const AddNewCustomerAddressSection = ({
    customerInfo,
    setCustomerInfo,
    uploadedFile, setUploadedFile,
    activeLocationsList
}: AddNewCustomerAddressSectionProps) => {
    const {
        address,
    } = customerInfo

    // address
    const {
        building,
        floor,
        apartment
    } = address

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setCustomerInfo({ ...customerInfo, address: { ...address, [name]: value } })
    }

    const handleChange: UploadProps['onChange'] = (info: any) => {
        const isJpgOrPngOrWebp = info.file.type === 'image/jpeg' ||
            info.file.type === 'image/png'
            || info.file.type === 'image/webp'
        if (!isJpgOrPngOrWebp) {
            setUploadedFile(null)
        }

        if (info.file.status === 'done') {
            setUploadedFile(info.file.originFileObj)
        }
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancelPreview = () => setPreviewOpen(false);

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj)
        }

        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
    }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok")
        }, 0)
    }

    const [selectedCity, setSelectedCity] = useState<any>()
    const [selectedZone, setSelectedZone] = useState<any>()
    const [selectedStreet, setSelectedStreet] = useState<any>()

    const handleCityChange = (e: string) => {
        activeLocationsList?.map((city) => {
            if (city._id === e) {
                setSelectedCity(city)
                setSelectedZone(city.zones[0])
                setSelectedStreet(city.zones[0].streets[0])

                setCustomerInfo({
                    ...customerInfo,
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
        selectedCity?.zones?.map((zone: LocationZone) => {
            if (zone._id === e) {
                setSelectedZone(zone)
                setSelectedStreet(zone.streets[0])

                setCustomerInfo({
                    ...customerInfo,
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
        selectedCity?.zones?.map((zone: LocationZone) => {
            zone.streets.map((street) => {
                if (street._id === e) {
                    setSelectedStreet(street)

                    setCustomerInfo({
                        ...customerInfo,
                        address: {
                            ...address,
                            street: street.name
                        }
                    })
                }
            })
        })
    }

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
                                value={selectedCity ? selectedCity?._id : 'Select City'}
                                style={{
                                    minWidth: '200px'
                                }}
                                placeholder='Select City'
                            >
                                {activeLocationsList && activeLocationsList?.map((city: Location) => (
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
                                value={selectedZone ? selectedZone?._id : 'Select Zone'}
                                style={{
                                    minWidth: '200px'
                                }}
                                placeholder='Select Zone'
                            >
                                {selectedCity?.zones?.length > 0 && selectedCity?.zones?.map((zone: LocationZone) => (
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
                                value={selectedStreet ? selectedStreet?._id : 'Select Street'}
                                style={{
                                    minWidth: '200px'
                                }}
                                placeholder='Select Street'
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

                <Form.Item
                    label='Building Picture'
                >
                    <Dragger
                        name="image"
                        showUploadList={uploadedFile ? true : false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        customRequest={(file: any) => dummyRequest(file)}
                        maxCount={1}
                        onPreview={handlePreview}
                        onRemove={() => setUploadedFile(null)}
                        listType="picture"
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single upload only.
                        </p>
                    </Dragger>
                </Form.Item>
            </Form>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancelPreview}
            >
                <img alt="profile-pic-preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default AddNewCustomerAddressSection