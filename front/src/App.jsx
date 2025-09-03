import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PaymentTest from './test'
import Appp from './test2'
import AuthTest from './newT/index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
{/*       
      <PaymentTest>
        
      </PaymentTest> */}

      {/* <Appp></Appp> */}

      <AuthTest></AuthTest>
    </>
  )
}

export default App
