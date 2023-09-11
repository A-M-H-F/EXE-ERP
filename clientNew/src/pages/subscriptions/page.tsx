import useDocumentMetadata from '@hooks/useDocumentMetadata'
import { useState, useEffect } from 'react'
import { Skeleton } from 'antd'
import { SubscriptionsList } from './components/list'

const CustomersSubscriptionsPage = () => {
    useDocumentMetadata('EX - Customers Subscriptions', 'Extreme Engineering - Customers Subscriptions Page')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    return (
        <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
            <SubscriptionsList />
        </Skeleton>
    )
}

export default CustomersSubscriptionsPage