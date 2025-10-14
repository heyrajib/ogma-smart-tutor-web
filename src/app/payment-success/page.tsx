'use client'

import { useEffect, useState } from 'react'

export default function PaymentSuccess() {
  const [paymentId, setPaymentId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Parse path parameters from URL on client side
    const pathname = window.location.pathname
    const pathParts = pathname.split('/').filter(Boolean)
    
    // Expected format: /payment-success/paymentId/amount
    if (pathParts.length >= 3) {
      const routePaymentId = pathParts[1]
      const routeAmount = pathParts[2]
      setPaymentId(routePaymentId)
      setAmount(routeAmount)
    } else {
      // Fallback: try to get from query parameters
      const urlParams = new URLSearchParams(window.location.search)
      const queryPaymentId = urlParams.get('paymentId') || ''
      const queryAmount = urlParams.get('amount') || ''
      
      if (queryPaymentId && queryAmount) {
        setPaymentId(queryPaymentId)
        setAmount(queryAmount)
      }
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>
        
        {paymentId && amount && (
          <div className="space-y-2 mb-6">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Payment ID:</span>
              <span className="text-gray-900 ml-2">{paymentId}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Amount:</span>
              <span className="text-gray-900 ml-2">₹{amount}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
