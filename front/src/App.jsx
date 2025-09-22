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
import SeySigorta from './pages/SeySig'
import HeyatSig from './pages/heyatSig'
import TibbiSig from './pages/tibbi'
import EmlakSig from './pages/emlakSig'
import NeqliySig from './pages/neqliySig'
import Register from './pages/register'
import Login from './pages/login'

function App() {


  return (
    <>

      <Routes>
        <Route path='/' element={<Client />}>
          <Route index element={<UmSig />} />
          <Route path='seyahet' element={<SeySigorta />} />
          <Route path='heyat' element={<HeyatSig />} />
          <Route path='tibbi' element={<TibbiSig />} />
          <Route path='emlak' element={<EmlakSig />} />
          <Route path='neqliyyat' element={<NeqliySig />} />
          <Route path='profile' element={<Profile />} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />


        </Route>
      </Routes>



    </>
  )
}

export default App
