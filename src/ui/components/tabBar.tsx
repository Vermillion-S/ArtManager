import React from 'react'
import {} from 'react-icons';
import { FcSettings } from 'react-icons/fc';
import { NavLink } from 'react-router-dom';

//Navbar component

type TabProps = {
    link: string;
    children: React.ReactNode;
    [key: string]: any;
};

const Tab = ({link, children, ...restProps} : TabProps) => {
  return (
   
        <div className="flex items-center" {...restProps}>
            <div className="flex-shrink-0 text-xl transition-all duration-200 hover:text-2xl">
                <NavLink className={({ isActive }) => isActive ? 'text-blue-500 font-bold' : 'text-white'} to={link}>
                    {children}
                </NavLink>
            </div>
        </div>
    )
}

const tabBar = () => {

    
  return (
    <div>
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-between  h-16 space-x-15">
                <div className="flex items-center justify-around h-16 space-x-15">
                    <Tab link="/">Schedule</Tab>
                    <Tab link="/practice">Practice</Tab>
                    <Tab link="/analytics">Analytics</Tab>
                </div>

                <NavLink to="/settings"><FcSettings size={"28px"} className="transition duration-300 ease-in-out hover:rotate-90"/></NavLink>
            </div>
        </nav>
    </div>
  )
}

export default tabBar
