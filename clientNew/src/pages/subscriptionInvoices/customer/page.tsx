import React from 'react'
import { useParams } from 'react-router-dom'

const CustomerSubscriptionInvoicesPage = () => {
  const { customerId } = useParams()
  
  return (
    <div>CustomerSubscriptionInvoicesPage</div>
  )
}

export default CustomerSubscriptionInvoicesPage