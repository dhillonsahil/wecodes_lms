import React from 'react'
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
    value:number;
    variant?:"default"|"success",
    size?:"default"|"sm";
}

const colorByVariant={
    default:"text-sky-700",
    success:"text-emerald-700"
}

const sizeByVariant = {
    default:"text-sm",
    small:"text-xs"
}

const CourseProgress = ({
    value,variant,size
}:CourseProgressProps) => {
  return (
    <div>
      <Progress className='h-2' variant={variant} value={value} />  
      <p className={cn('font-mdeium mt-2 text-sky-700',colorByVariant[variant || 'default'],colorByVariant[size || 'default'])}>{Math.round(value)}% complete</p>
    </div>
  )
}

export default CourseProgress