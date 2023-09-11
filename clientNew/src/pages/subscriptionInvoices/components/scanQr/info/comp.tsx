import { CalendarOutlined, DollarOutlined, FieldNumberOutlined, PhoneOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons'
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices'
import { Badge, Col, Form, Input, Row, Typography } from 'antd'

type QrSubscriptionInvoiceInfoProps = {
  invoice: SubscriptionInvoice,
}

const QrSubscriptionInvoiceInfo = ({ invoice }: QrSubscriptionInvoiceInfoProps) => {
  return (
    <Form
      layout='vertical'
    >
      <Row gutter={[16, 16]}
        style={{
          width: 'auto'
        }}
      >
        <Col>
          <Typography.Link target='_blank' href={`/customers/info/${invoice.customer._id}`}>
            <Form.Item label='Customer Name'>
              <Input value={invoice.customer.fullName} readOnly prefix={<UserOutlined />} />
            </Form.Item>
          </Typography.Link>
        </Col>

        <Col>
          <Form.Item label='Arabic Name'>
            <Input value={invoice.customer.arabicName} readOnly prefix={<UserOutlined />} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label='Phone Number'>
            <Input value={invoice.customer.phoneNumber} readOnly prefix={<PhoneOutlined />} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label='Internet Service'>
            <Input value={invoice.service.service} readOnly prefix={<WifiOutlined />} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label='Serial Number'>
            <Input value={invoice.serialNumber} readOnly prefix={<FieldNumberOutlined />} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label='Payment Status'>
            <Badge.Ribbon
              text={invoice.paymentStatus === 'paid' ? 'Paid' : 'Not Paid'}
              color={invoice.paymentStatus === 'paid' ? 'green' : 'red'}
            >
              <Input value={invoice.paymentStatus} readOnly prefix={<DollarOutlined />} />
            </Badge.Ribbon>
          </Form.Item>
        </Col>

        {invoice.paymentStatus === 'paid' &&
          <Col>
            <Form.Item label='Payment Date'>
              <Input value={new Date(invoice.paymentDate).toLocaleDateString('en-GB')} readOnly prefix={<CalendarOutlined />} />
            </Form.Item>
          </Col>
        }

        {invoice.paymentStatus === 'paid' &&
          <Col>
            <Form.Item label='Collector'>
              <Input value={invoice.collector.name} readOnly prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        }

        <Col>
          <Form.Item label='Subscription Month'>
            <Input value={invoice.invoiceMonth} readOnly prefix={<CalendarOutlined />} />
          </Form.Item>
        </Col>

        {invoice.printedBy &&
          <Col>
            <Form.Item label='Print By'>
              <Input value={invoice.printedBy.name} readOnly prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        }

        {invoice.printDate &&
          <Col>
            <Form.Item label='Print At'>
              <Input value={new Date(invoice.printDate).toLocaleDateString('en-GB')} readOnly prefix={<CalendarOutlined />} />
            </Form.Item>
          </Col>
        }

        <Col>
          <Form.Item label='Entry Date'>
            <Input value={new Date(invoice.createdAt).toLocaleDateString('en-GB')} readOnly prefix={<CalendarOutlined />} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label='Entry By'>
            <Input value={invoice.createdBy.name} readOnly prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default QrSubscriptionInvoiceInfo