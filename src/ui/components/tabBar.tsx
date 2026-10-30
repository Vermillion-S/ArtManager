import React from 'react'
import { FcSettings } from 'react-icons/fc';
import { NavLink } from 'react-router-dom';
import { motion as m } from 'motion/react';

//Navbar component

type TabProps = {
    link: string;
    children: React.ReactNode;
    [key: string]: any;
};

const Tab = ({link, children, ...restProps} : TabProps) => {
  return (
   
        <div className="flex items-center" {...restProps}>
            <m.div 

                whileHover={{
                    scale: 1.15,
                    transition: {type: "spring", stiffness:400, bounce:20}
                }}
                className="flex-shrink-0 text-xl">

                <NavLink className={({ isActive }) => isActive ? 'text-blue-500 font-bold' : 'text-white'} to={link}>
                    {children}
                </NavLink>
            </m.div>
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
                    <Tab link="/submission">Submission</Tab>
                    <Tab link="/practice">Practice</Tab>
                    <Tab link="/analytics">Analytics</Tab>
                </div>

                <m.div
                    whileHover={{
                        rotate: 45
                    }}>
                    <NavLink to="/settings"><FcSettings size={"28px"}/></NavLink>
                </m.div>
                
            </div>
        </nav>
    </div>
  )
}

export default tabBar
