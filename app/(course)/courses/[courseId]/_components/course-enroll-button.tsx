'use client'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const CourseEnrollButton = ({price,courseId}:{price:number,courseId:string}) => {
  const [isLoading,setIsLoading]=useState(false);

  const router=useRouter();
  const onClick = async()=>{
    try{
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      router.push(response.data.url)
      // window.location.assign(response.data.url)
    }catch(error){
      toast.error("Something went wrong")
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={onClick} disabled={isLoading} size={'sm'} className='w-full md:w-auto'>
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton