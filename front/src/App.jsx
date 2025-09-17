import { useState } from 'react'

import './App.css'

// import AuthTest from './newT/index'
// import CategoryManager from './comoponents/category'
// import CompanyManager from './comoponents/company'
// import DocumentManager from './comoponents/document'
// import OrderManager from './comoponents/orders'
// import FormManager from './comoponents/user'
import { Route, Routes } from 'react-router-dom'
import Client from './comoponents/client'
import Profile from './pages/profil'
import UmSig from './pages/umumiSig'

function App() {


  return (
    <>

      <Routes>
        <Route path='/' element={<Client/>}>
          <Route index element={<UmSig/>}/>
          <Route path='profile' element={<Profile/>}/>
        </Route>
      </Routes>
        
    

    </>
  )
}

export default App
