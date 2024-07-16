import React from 'react'
import { Menu } from 'lucide-react';
import SideBar from './Sidebar';

import {
Sheet, SheetContent, SheetTrigger
} from '@/components/ui/sheet'

const MobileSidebar = () => {
  return (
    <Sheet>
        <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
        </SheetTrigger>
        <SheetContent side={'left'} className='p-0 bg-white'>
            <SideBar />
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar