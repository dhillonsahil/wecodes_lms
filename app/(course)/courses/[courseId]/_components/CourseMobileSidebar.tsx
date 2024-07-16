import { Menu } from 'lucide-react'
import React from 'react'
import {Chapter,Course,UserProgress} from '@prisma/client'
import { SheetContent, SheetTrigger ,Sheet} from '@/components/ui/sheet';
import CourseSidebar from './CourseSidebar';


interface MobileSidebarProps {
    course : Course & {
        chapters :( Chapter & {
          userProgress : UserProgress | null
        }
        )[];
      };
      progressCount : number
}

const CourseMobileSidebar = ({
    course,progressCount
  }: MobileSidebarProps) => {
  return (
    <Sheet>
        <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transisiton'>
            <Menu />
        </SheetTrigger>
        <SheetContent side={'left'} className='p-0 bg-white w-72' >
            <CourseSidebar course={course} progressCount={progressCount} />
        </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar