import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PaymentTest from './test'
import Appp from './test2'
import InsuranceForm from './test3'
import TripForm from './test4'
import App2 from './test5'
import WebhookTester from './test2'
import OtpTester from './test'
import CreateOrderTester from './test4'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      {/* <PaymentTest>
        
      </PaymentTest> */}

      {/* <Appp></Appp> */}

      <InsuranceForm></InsuranceForm>
      {/* <TripForm></TripForm> */}
      {/* <App2></App2> */}
      {/* <WebhookTester></WebhookTester> */}
      {/* <OtpTester></OtpTester> */}
      {/* <CreateOrderTester></CreateOrderTester> */}
    </>
  )
}

export default App
