import { useState } from 'react'

import './App.css'

import AuthTest from './newT/index'
import CategoryManager from './com[ponents/category'
import CompanyManager from './com[ponents/company'
import DocumentManager from './com[ponents/document'
import OrderManager from './com[ponents/orders'
import FormManager from './com[ponents/user'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      {/* <PaymentTest>
        
      </PaymentTest> */}

      {/* <Appp></Appp> */}

      {/* <AuthTest></AuthTest> */}

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Insurance Dashboard</h1>
        <CategoryManager />
        <CompanyManager />
        <DocumentManager />
        <OrderManager/>
        <FormManager/>
      </div>

    </>
  )
}

export default App
