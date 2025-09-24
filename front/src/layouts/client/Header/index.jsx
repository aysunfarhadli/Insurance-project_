import React from 'react';
import './index.scss';
import { FaRegBell } from 'react-icons/fa6';
import { CgProfile } from 'react-icons/cg';
import { IoMenu } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';

const Cheader = () => {
  return (
    <header>
      <div className='container'>
        <div className='all'>
          {/* Logo or Brand - navigates to home */}
          <NavLink to="/" className="logo">
            <h2>CİB sığorta</h2>
          </NavLink>

          {/* You can replace input with a search component or keep it */}
          <input placeholder="Search..." />

          <div className='icons'>
            <NavLink to="/notifications" className="icon">
              <FaRegBell />
            </NavLink>

            <NavLink to="/profile" className="icon">
              <CgProfile />
            </NavLink>

            <NavLink to="/menu" className="icon">
              <IoMenu />
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cheader;
