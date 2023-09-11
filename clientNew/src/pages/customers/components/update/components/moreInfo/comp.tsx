import { MinusCircleOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Typography } from 'antd'
import React from 'react'

type UpdateCustomerMoreInfoSectionProps = {
    moreInfo: string | any,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setPhoneNumbers: (e: PhoneNumber[]) => void,
    phoneNumbers: PhoneNumber[]
}

type PhoneNumber = {
    key: number,
    number: string
}

const UpdateCustomerMoreInfoSection = ({ 
    moreInfo,
    handleInputChange,
    setPhoneNumbers,
    phoneNumbers
}: UpdateCustomerMoreInfoSectionProps) => {
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
                    More Details
                </Typography>

                <Form.Item
                    label='More Info'
                >
                    <Input.TextArea
                        name='moreInfo'
                        value={moreInfo}
                        onChange={(e: any) => handleInputChange(e)}
                        placeholder='More details'
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item
                    label='Additional Phone Numbers'
                >
                    {phoneNumbers?.map((phone: PhoneNumber, index: number) => (
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

                            <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => onRemovePhone(phone.key)}
                            />
                        </Space>
                    ))}
                </Form.Item>
                <Form.Item>
                    <Button type="dashed" onClick={onAddPhone} block icon={<PlusOutlined />}>
                        Add Phone Number
                    </Button>
                </Form.Item>
            </Form>
        </>
  )
}

export default UpdateCustomerMoreInfoSection