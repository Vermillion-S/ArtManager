import React from 'react'
import {} from 'react-icons';

//Navbar component

const Tab = ({link, children, ...restProps}) => {
  return (
   
        <div className="flex items-center" {...restProps}>
            <div className="flex-shrink-0">
                <h2 className="text-white text-xl font-bold">{children}</h2>
            </div>
        </div>
    )
}

const tabBar = () => {
  return (
    <div>
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-around h-16">
                    <Tab link="/">Schedule</Tab>
                    <Tab link="/">Practice</Tab>
                    <Tab link="/">Analytics</Tab>
                    <Tab link="/" className=" hover:text-gray-300">
                        Account
                    </Tab>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default tabBar
