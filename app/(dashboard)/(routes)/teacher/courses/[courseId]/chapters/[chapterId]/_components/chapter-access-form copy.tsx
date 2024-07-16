'use client'
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
    FormControl,Form,FormItem,FormField,FormMessage,
    FormDescription
} from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import Editor from '@/components/editor';
import Preview from '@/components/preview';
import { Checkbox } from '@/components/ui/checkbox';


interface ChapterAccessFormProps{
    initialData : Chapter
    courseId:string,
    chapterId :string
}



const formSchema = z.object({
    isFree:z.boolean().default(false)
})

const ChapterAccessForm = ({initialData,courseId,chapterId}:ChapterAccessFormProps) => {
    
    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:  {
            isFree : Boolean(initialData.isFree)
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
            Chapter access
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing && (
                        <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Access
                        </>
                    ) 
                }
                
            </Button>
        </div>
        {
            !isEditing && (
                <div className={cn('text-sm mt-2',!initialData.isFree && "text-slate-500 italic")}>
                    {
                        initialData.isFree ? "This chapter is free for preview" : "This chapter is not free for preview"
                    }
                </div>
            )
        }
        {
            isEditing && (
                <Form {...form} >
                    <form className='space-y-4 mt-4' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField 
                        control={form.control}
                        name="isFree"
                        render ={({field})=>(
                              <FormItem className='flex flex-row items-start space-y-0 rounded-md border p-4 space-x-3' >
                                <FormControl>
                                    
                                <Checkbox  checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormDescription>Check this box if you want to make this chapter free for preview</FormDescription>
                                </div>
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

export default ChapterAccessForm