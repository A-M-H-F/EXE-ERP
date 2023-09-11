import { AuthState } from '@features/reducers/auth'
import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { hasPermission } from '@utils/roles/permissionUtils'
import { Skeleton, Space } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AddNewSubscriptionInvoice } from './components/addNew'
import { SubscriptionInvoicesList } from './components/list'
import { SubscriptionInvoiceQrScanner } from './components/scanQr'

const SubscriptionInvoicesPage = () => {
  useDocumentMetadata('EX - Subscription Invoices', 'Extreme Engineering - Subscription Invoices Page')

  // Check permissions
  const { role } = useSelector((state: AuthState) => state.auth)
  const canAdd = hasPermission(role, 'Subscription Invoices', 'Create')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role) {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    }
  }, [role])

  return (
    <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Space>
          <SubscriptionInvoiceQrScanner />

          {canAdd &&
            <AddNewSubscriptionInvoice />
          }
        </Space>
      </div>

      <SubscriptionInvoicesList />
    </Skeleton>
  )
}

export default SubscriptionInvoicesPage