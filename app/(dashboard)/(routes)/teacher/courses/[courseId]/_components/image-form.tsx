'use client'
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ImageFormProps{
    initialData :Course
    courseId:string
}




const ImageForm = ({initialData,courseId} : ImageFormProps) => {
    const formSchema = z.object({
        imageUrl:z.string().min(1, {
            message:"Image is required"
        })
    })
    
    const router=useRouter();

    

    const [isEditing, setIsEditing] = useState(false)

    const onSubmit = async (values:z.infer <typeof formSchema>) => {
        try {
             await axios.patch(`/api/courses/${courseId}`,values);
            toast.success("Course updated")
            setIsEditing(false)
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong")
        }
    }
    const toggleEdit = () => setIsEditing(!isEditing)

  return (
    <div className='mt-5 bg-slate-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between">
            Course Image
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing && !initialData.imageUrl && (
                        <>
                        <PlusCircle className='h-4 w-4 mr-2' />Add an image
                        </>
                    )}
                {
                    !isEditing  && initialData.imageUrl && (
                        <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Image
                        </>
                    ) 
                }
                
            </Button>
        </div>
        {
            !isEditing && (
                !initialData.imageUrl ?(<div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                    <ImageIcon className='h-10 w-10 text-slate-500' />
                </div>):(<div className='relative aspect-video mt-2'>
                    <Image src={initialData.imageUrl} alt='Upload' fill className='object-cover rounded-md' />
                </div>)
            )
        }
        {
            isEditing && (
                <div className="">
                    <FileUpload endpoint='courseImage' onChange={(url)=>{
                        if(url){
                            onSubmit({imageUrl:url})
                        }
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommded
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ImageForm