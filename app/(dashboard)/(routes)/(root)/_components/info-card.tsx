import { IconBadge } from '@/components/icon-badge'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface InfoCardProps {
    numberOfItems : number;
    variant?:"default"|"success";
    label:string
    icon:LucideIcon
}

const InfoCard = ({
    variant,icon:Icon,label,numberOfItems
}:InfoCardProps) => {
  return (
    <div className='rounded-md border flex items-center gap-x-2 p-3'>
        <IconBadge icon={Icon}  variant={variant} />
        <div>
            <p className='font-medium'>
                {label}
            </p>
            <p className='text-gray-500 text-sm'>
                {numberOfItems} {numberOfItems==1?"Course":"Courses"}
            </p>
        </div>

    </div>
  )
}

export default InfoCard