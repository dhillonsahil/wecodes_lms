import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './SidebarRoutes'

const SideBar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow'>
        <div className="p-6 h-[80px]">
            <Logo />
        </div>
        <div className="flex flex-col w-full">
            <SidebarRoutes />
        </div>
    </div>
  )
}

export default SideBar