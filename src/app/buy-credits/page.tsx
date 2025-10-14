'use client'

import { useEffect, useState, useCallback } from 'react'

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string | undefined
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void
    }
  }
}

export default function BuyCredits() {
  const [orderId, setOrderId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const handlePayment = useCallback(() => {
    if (!window.Razorpay) {
      setError('Razorpay script not loaded')
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: parseInt(amount) * 100,
      currency: 'INR',
      name: 'Smart Tutor',
      description: 'Buy Credits',
      order_id: orderId,
      handler: function (response: RazorpayResponse) {
        window.location.href = `/payment-success/${response.razorpay_payment_id}/${amount}`
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: function() {
          window.location.href = `/payment-failure/${orderId}/${amount}`
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }, [orderId, amount])

  useEffect(() => {
    // Parse path parameters from URL on client side
    const pathname = window.location.pathname
    const pathParts = pathname.split('/').filter(Boolean)
    
    // Expected format: /buy-credits/orderId/amount
    if (pathParts.length >= 3) {
      const routeOrderId = pathParts[1]
      const routeAmount = pathParts[2]
      setOrderId(routeOrderId)
      setAmount(routeAmount)
    } else {
      // Fallback: try to get from query parameters
      const urlParams = new URLSearchParams(window.location.search)
      const queryOrderId = urlParams.get('orderId') || ''
      const queryAmount = urlParams.get('amount') || ''
      
      if (queryOrderId && queryAmount) {
        setOrderId(queryOrderId)
        setAmount(queryAmount)
      } else {
        setError('Invalid payment parameters')
      }
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading && orderId && amount && !error) {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        // Auto-trigger payment when script loads
        handlePayment()
      }
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [loading, orderId, amount, error, handlePayment])



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Please wait while we redirect you to the payment gateway...</p>
        <p className="text-sm text-gray-500 mt-2">Order: {orderId} | Amount: ₹{amount}</p>
      </div>
    </div>
  )
}
