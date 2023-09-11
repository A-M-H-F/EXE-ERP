import React from 'react'
import { useParams } from 'react-router-dom'

const InvoiceInfoPage = () => {
    const { invoiceId } = useParams()
    
  return (
    <div>InvoiceInfoPage</div>
  )
}

export default InvoiceInfoPage