'use client'
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
    FormControl,Form,FormItem,FormField,FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import Editor from '@/components/editor';
import Preview from '@/components/preview';


interface ChapterDescriptionFormProps{
    initialData : Chapter
    courseId:string,
    chapterId :string
}



const formSchema = z.object({
    description:z.string().min(1)
})

const ChapterDescriptionForm = ({initialData,courseId,chapterId}:ChapterDescriptionFormProps) => {
    
    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:  {
            description : initialData.description || ""
        },
    })

    const [isEditing, setIsEditing] = useState(false)
    const {isSubmitting,isValid} = form.formState;

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
            Chapter Description
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing && (
                        <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Description
                        </>
                    ) 
                }
                
            </Button>
        </div>
        {
            !isEditing && (
                <div className={cn('text-sm mt-2',!initialData.description && "text-slate-500 italic")}>
                    {!initialData.description && 'No Description'}
                    {initialData.description && (
                        <Preview value={initialData.description} />
                    )}
                </div>
            )
        }
        {
            isEditing && (
                <Form {...form} >
                    <form className='space-y-4 mt-4' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField 
                        control={form.control}
                        name="description"
                        render ={({field})=>(
                              <FormItem >
                                <FormControl>
                                    <Editor  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={isSubmitting || !isValid} type="submit">
                                Save</Button>
                        </div>
                    </form>
                </Form>
            )
        }
    </div>
  )
}

export default ChapterDescriptionForm