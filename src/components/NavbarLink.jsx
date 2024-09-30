// src/components/NavbarLink.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavbarLink = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center space-x-3 p-4 rounded-lg 
        transition-all duration-300 ease-out
        hover:bg-gray-700 hover:shadow-2xl hover:scale-105 
        ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400'}
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default NavbarLink;
