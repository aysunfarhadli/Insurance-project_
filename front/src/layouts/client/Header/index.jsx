import React from 'react'
import './index.scss'
import { FaRegBell } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { IoMenu } from "react-icons/io5";


const Cheader = () => {
  return (
    <header>
      <div className='container'>
        <div className='all'>
          <h2>CİB sığorta</h2>

          <input/>

          <div className='icons'>
          <FaRegBell />
          <CgProfile/>
          <IoMenu/>

          </div>
        </div>
      </div>

    </header>
  )
}

export default Cheader