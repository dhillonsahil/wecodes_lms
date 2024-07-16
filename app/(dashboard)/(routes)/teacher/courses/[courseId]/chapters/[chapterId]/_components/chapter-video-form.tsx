'use client'
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { Chapter, MuxData } from '@prisma/client';
import { FileUpload } from '@/components/file-upload';
import dynamic from 'next/dynamic';
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false }); // Load MuxPlayer dynamically with ssr: false

interface ChapterVideoProps{
    initialData :Chapter & {
        muxData? : MuxData | null
    }
    courseId:string;
    chapterId:string
}
const formSchema = z.object({
    videoUrl:z.string().min(1)
})

const ChapterVideoForm = ({initialData,courseId,chapterId} : ChapterVideoProps) => {

    
    const router=useRouter();

    

    const [isEditing, setIsEditing] = useState(false)

    const onSubmit = async (values:z.infer <typeof formSchema>) => {
        try {
             await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values);
            toast.success("Chapter updated")
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
            Chapter Video
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing && !initialData.videoUrl && (
                        <>
                        <PlusCircle className='h-4 w-4 mr-2' />Add an Video
                        </>
                    )}
                {
                    !isEditing  && initialData.videoUrl && (
                        <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Video
                        </>
                    ) 
                }
                
            </Button>
        </div>
        {
            !isEditing && (
                !initialData.videoUrl ?(<div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                    <Video className='h-10 w-10 text-slate-500' />
                </div>):(<div className='relative aspect-video mt-2'>
                    <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
                </div>)
            )
        }
        {
            isEditing && (
                <div className="">
                    <FileUpload endpoint='chapterVideo' onChange={(url)=>{
                        if(url){
                            onSubmit({videoUrl:url})
                        }
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )
        }{
           initialData.videoUrl && !isEditing && (
            <div className='text-xs text-muted-foreground mt-2'>
                Videos can take a few minutes to process. Refresh the page if video does not appear
            </div>
           ) 
        }
    </div>
  )
}

export default ChapterVideoForm