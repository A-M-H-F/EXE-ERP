import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import dayjs from 'dayjs'
import extremeEngImg from '@assets/images/logo/extremeEng.jpg'
import { Divider, Image, QRCode, Space, Typography } from 'antd'

type SubscriptionInvoicePrintTemplateProps = {
    invoice: SubscriptionInvoice
}

const SubscriptionInvoicePrintTemplate = ({ invoice }: SubscriptionInvoicePrintTemplateProps) => {
    const handleConvertStringToCode = () => {
        const accountName = invoice?.customer?.accountName;
        const code = invoice?.service?.ref?.isp?.code;

        const cleanedAccountName = accountName?.replace(/\D/g, '');

        const convertedString = `${code}${cleanedAccountName}`;
        return convertedString;
    }

    return (
        <>
            <div
                style={{
                    textAlign: 'center'
                }}
            >
                <Image
                    src={extremeEngImg}
                    preview={false}
                    width={'8em'}
                />
            </div>

            <div
                style={{
                    textAlign: 'center',
                    marginTop: '1em'
                }}
            >
                <Typography.Text>
                    No. N {invoice?.serialNumber}
                </Typography.Text>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl',
                }}
            >
                <Space>
                    <Typography.Text>
                        التاريخ:
                    </Typography.Text>
                    <Typography.Text
                        style={{
                            marginRight: '30px'
                        }}
                    >
                        {dayjs()?.format('MM/YYYY')}
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl'
                }}
            >
                <Space>
                    <Typography.Text>
                        وصلنا من:
                    </Typography.Text>
                    <Typography.Text
                        style={{
                            marginRight: '11px'
                        }}
                    >
                        السيد\ة
                    </Typography.Text>
                    <Typography.Text>
                        {invoice?.customer?.arabicName}
                    </Typography.Text>
                    <Typography.Text>
                        المحترم\ة
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl'
                }}
            >
                <Space>
                    <Typography.Text>
                        مبلغ و قدره:
                    </Typography.Text>
                    <Typography.Text>
                        ${invoice?.service?.price}
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl'
                }}
            >
                <Space>
                    <Typography.Text>
                        رقم الهاتف:
                    </Typography.Text>
                    <Typography.Text
                        style={{
                            marginRight: '5px'
                        }}
                    >
                        {invoice?.customer?.phoneNumber}
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl'
                }}
            >
                <Space>
                    <Typography.Text>
                        رقم اشتراك:
                    </Typography.Text>
                    <Typography.Text
                        style={{
                            marginRight: '5px'
                        }}
                    >
                        {invoice && handleConvertStringToCode()}
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl'
                }}
            >
                <Space>
                    <Typography.Text>
                        وذلك بدل:
                    </Typography.Text>
                    <Typography.Text
                        style={{
                            marginRight: '11px'
                        }}
                    >
                        اشتراك انترنت شهر
                    </Typography.Text>
                    <Typography.Text>
                        {invoice?.invoiceMonth}
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    textAlign: 'right',
                    marginTop: '1em',
                    direction: 'rtl'
                }}
            >
                <Space>
                    <Typography.Text>
                        العنوان:
                    </Typography.Text>
                    <Typography.Text
                    >
                        {invoice?.customer.address.city} | {invoice?.customer.address.zone} | {invoice?.customer.address.street}
                    </Typography.Text>
                </Space>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2em'
                }}
            >
                <QRCode
                    value={invoice._id}
                    errorLevel='H'
                />
            </div>

            <Divider
                style={{
                    marginBottom: '0'
                }}
            />

            <div
                style={{
                    textAlign: 'right',
                    direction: 'rtl'
                }}
            >
                <Typography.Text>
                    الغازية - العين - قرب محطة حمدان - 81/224846
                </Typography.Text>
            </div>
        </>
    )
}

export default SubscriptionInvoicePrintTemplate