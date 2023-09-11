import PublicDateRangePicker, { DateRange, PickerType } from '@components/publicDateRangePicker/comp';
import { InternetService } from '@features/reducers/internetServices';
import { SubscriptionInvoice } from '@features/reducers/subscriptionInvoices';
import SubscriptionInvoicePrintHistory from '@pages/subscriptionInvoices/components/list/components/printHistory/comp';
import ViewSubscriptionInvoiceQrCode from '@pages/subscriptionInvoices/components/list/components/viewQr/comp';
import { User } from '@utils/types';
import { Card, Divider, Space, Tag, Segmented, Typography } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import { useState } from 'react'
import CollectSubscriptionInvoice from './components/collect/comp';
import { PrintSubInvoice } from './components/print';
import { useWindowDimensions } from '@hooks/useWindowDimensions';

type CustomerSubscriptionInvoicesProps = {
  invoices: SubscriptionInvoice[],
  activeInternetServices: InternetService[],
  usersSelection: any,
  loading: boolean,
  dateRange: DateRange,
  setDateRange: (value: DateRange) => void,
  fieldType: SegmentedValue,
  setFieldType: (value: SegmentedValue) => void
}

const CustomerSubscriptionInvoices = ({
  invoices,
  activeInternetServices,
  usersSelection,
  loading,
  dateRange,
  setDateRange,
  fieldType,
  setFieldType,
}: CustomerSubscriptionInvoicesProps) => {
  // picker
  const [type, setType] = useState<PickerType>('month')

  const { screenSizes } = useWindowDimensions()
  const { xs, sm, md } = screenSizes

  const filtersInternetS = activeInternetServices?.map((service) => (
    {
      text: service.service,
      value: service.service
    }
  ))
  const filtersPaymentStatus = [
    {
      text: 'Paid',
      value: 'paid'
    },
    {
      text: 'Not-Paid',
      value: 'unPaid'
    }
  ]
  const filterUsers = usersSelection?.map((user: User) => (
    {
      text: user?.name,
      value: user?.name,
    }
  ))

  const columns: ColumnsType<any> = [
    {
      title: 'Service',
      key: 'service',
      dataIndex: 'service',
      render: (service) => service?.service,
      filters: filtersInternetS,
      filterSearch: true,
      onFilter: (value: any, record: SubscriptionInvoice) => record?.service.service === value,
    },
    {
      title: 'Account',
      key: 'accountName',
      dataIndex: 'customer',
      render: (customer) => customer?.accountName,
      // filters: filtersAccountNames,
      filterSearch: true,
      onFilter: (value: any, record: SubscriptionInvoice) => record?.customer.accountName === value,
    },
    {
      title: 'Serial Number',
      key: 'serialNumber',
      dataIndex: 'serialNumber',
      filterSearch: true,
      onFilter: (value: any, record: SubscriptionInvoice) => record?.serialNumber === value,
    },
    {
      title: 'Status',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      filters: filtersPaymentStatus,
      filterSearch: true,
      onFilter: (value: any, record: SubscriptionInvoice) => record?.paymentStatus === value,
      render: (_, record: SubscriptionInvoice) => (
        record?.paymentStatus === 'paid' ?
          <Tag color='green'>Paid</Tag> :
          <Tag color='red'>Not Paid</Tag>
      ),
    },
    {
      title: 'Payment Date',
      key: 'paymentDate',
      dataIndex: 'paymentDate',
      render: (paymentDate) => paymentDate ? new Date(paymentDate).toLocaleDateString('en-GB') : '------',
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.paymentDate as string).getTime();
        const dateB = new Date(b.paymentDate as string).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Collector',
      key: 'collector',
      dataIndex: 'collector',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.collector?.name === value,
      filters: filterUsers,
      render: (collector) => (
        collector?.name ? <a target='_blank' href={`/users/${collector?._id}`}>{collector?.name}</a>
          : '------'
      )
    },
    {
      title: 'Month',
      key: 'invoiceMonth',
      dataIndex: 'invoiceMonth',
      render: (invoiceMonth) => <a>{invoiceMonth}</a>,
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.invoiceDate as string).getTime();
        const dateB = new Date(b.invoiceDate as string).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Printed By',
      key: 'printedBy',
      dataIndex: 'printedBy',
      filterSearch: true,
      onFilter: (value: any, record: any) => record?.printedBy?.name === value,
      filters: filterUsers,
      render: (printedBy) => (
        printedBy?.name ? <a target='_blank' href={`/users/${printedBy?._id}`}>{printedBy?.name}</a>
          : '------'
      )
    },
    {
      title: 'Printed At',
      key: 'printDate',
      dataIndex: 'printDate',
      render: (printDate) => printDate ? new Date(printDate).toLocaleDateString('en-GB') : '------',
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.printDate as string).getTime();
        const dateB = new Date(b.printDate as string).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Entry Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : '-----',
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.createdAt as string).getTime();
        const dateB = new Date(b.createdAt as string).getTime();
        return dateA - dateB;
      }
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: '_id',
      render: (_, record: SubscriptionInvoice) => (
        <Space>
          <CollectSubscriptionInvoice invoice={record}/>
          <SubscriptionInvoicePrintHistory id={record._id} />
          <ViewSubscriptionInvoiceQrCode invoiceId={record._id} />
          <PrintSubInvoice invoice={record} />
        </Space>
      )
    }
  ]

  const pageSize = () => {
    const totalSize: any = invoices?.length
    const options = []

    for (let start = 10; start <= totalSize;) {
      options.push(start);
      if (start >= 50) {
        start += 50;
      } else if (start >= 30) {
        start += 20;
      } else {
        start += 10;
      }
    }

    return options
  }

  return (
    <Card hoverable>
      <Table
        loading={loading}
        columns={columns}
        dataSource={invoices}
        rowKey={'_id'}
        bordered
        scroll={{ x: 1400, }}
        pagination={{
          showTotal: (total) => <div style={{ color: 'blue' }}>Total: {total}</div>,
          pageSizeOptions: invoices?.length >= 10 ?
            [...pageSize(), invoices?.length] : [...pageSize()],
          showSizeChanger: true
        }}
        title={() => (
          <div
            style={{
              display: xs || sm || md ? 'block' : 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              style={{
                fontSize: '20px',
                textAlign: xs || sm || md ? 'center' : 'left'
              }}
            >
              Subscription Invoices
            </Typography>


            <Space direction={xs || sm || md ? 'vertical' : 'horizontal'}>
              <div>
                Total: {invoices?.length}
              </div>

              <Divider type={xs || sm || md ? 'horizontal' : 'vertical'} />

              <Segmented
                options={['Invoice Date', 'Payment Date', 'Entry Date']}
                value={fieldType}
                onChange={(e: SegmentedValue) => setFieldType(e)}
              />

              <PublicDateRangePicker
                setDateRange={setDateRange}
                dateRange={dateRange}
                type={type}
                setType={setType}
              />
            </Space>
          </div>
        )}
      />
    </Card>
  )
}

export default CustomerSubscriptionInvoices