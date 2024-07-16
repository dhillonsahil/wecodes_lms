'use client'
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Attachment } from '@prisma/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps{
    initialData :Course & {attachments : Attachment[]}
    courseId:string
}




const AttachmentForm = ({initialData,courseId} : AttachmentFormProps) => {
    const formSchema = z.object({
        url:z.string().min(1)
    })
    
    const router=useRouter();

    const [deletingId,setDeletingId]=useState<string | null>(null) 
    const [isEditing, setIsEditing] = useState(false)

    const onSubmit = async (values:z.infer <typeof formSchema>) => {
        try {
             await axios.post(`/api/courses/${courseId}/attachments`,values);
            toast.success("Course updated")
            setIsEditing(false)
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong")
        }
    }
    const toggleEdit = () => setIsEditing(!isEditing)

    const onDelete = async(id:string)=>{
        try {
            setDeletingId(id);

            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success('Attachment deleted');
            router.refresh();

        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setDeletingId(null)
        }
    }

  return (
    <div className='mt-5 bg-slate-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between">
            Course Attachments
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing  && (
                        <>
                        <PlusCircle className='h-4 w-4 mr-2' />Add an File
                        </>
                    )}
                
            </Button>
        </div>
        {
            !isEditing && (
                <>
                {
                    initialData.attachments.length===0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>
                            No attachments yet
                        </p>
                    )
                }
                {
                    initialData.attachments.length >0 && (
                        <div>
                            {initialData.attachments.map((attachment)=>(
                                <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                    <p className='text-xs line-clamp-1'>
                                        {attachment.name}
                                    </p>
                                    { deletingId === attachment.id && (
                                        <div className="">
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        </div>
                                    )}
                                    { deletingId !== attachment.id && (
                                        <button onClick={()=>onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                                            <X className='h-4 w-4 ' />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                    )
                }
                </>
             )
        }
        {
            isEditing && (
                <div className="">
                    <FileUpload endpoint='courseAttachment' onChange={(url)=>{
                        if(url){
                            onSubmit({url:url})
                        }
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add any your student might need to complete the course
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default AttachmentForm