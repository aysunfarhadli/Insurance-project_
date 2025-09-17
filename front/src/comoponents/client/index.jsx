import React from 'react'
import Cheader from '../../layouts/client/Header'
import { Outlet } from 'react-router-dom'
import Cfooter from '../../layouts/client/Footer'

const Client = () => {
  return (
    <>
        <Cheader/>
        <Outlet/>
        <Cfooter/>

    </>
  )
}

export default Client