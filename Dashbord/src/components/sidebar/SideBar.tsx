import { useState } from 'react';
import './Sidebar.scss'; 
import {useNavigate} from 'react-router-dom'
import logo from '../../assets/logo/Qlogo.png'

import { FaHome,FaBook } from 'react-icons/fa';


const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
   const navigate = useNavigate()

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome className="sidebar-icon" />,path: '/'  },
    { name: 'Subjects', icon: <FaBook className="sidebar-icon"/>,  path:'/subjects'},
   

  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Quiz Champ" className="logo" />
        </div>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div 
            key={item.name}
            className={`sidebar-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => {
              setActiveItem(item.name);
              navigate(item.path);
            }}
          >
            <div className="sidebar-icon-container">{item.icon}</div>
            <div className="sidebar-text">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;