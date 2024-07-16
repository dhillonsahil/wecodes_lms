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
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';

interface TitleFormProps{
    initialData :{
        title:string;
    };
    courseId:string
}




const TitleForm = ({initialData,courseId}:TitleFormProps) => {
    const formSchema = z.object({
        title:z.string().min(1, {
            message:"Title is required"
        })
    })
    
    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:  initialData,
    })

    const [isEditing, setIsEditing] = useState(false)
    const {isSubmitting,isValid} = form.formState;

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
            Course Title
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing && (
                        <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit title
                        </>
                    ) 
                }
                
            </Button>
        </div>
        {
            !isEditing && (
                <p className='text-sm mt-2'>
                    {initialData.title}
                </p>
            )
        }
        {
            isEditing && (
                <Form {...form} >
                    <form className='space-y-4 mt-4' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField 
                        control={form.control}
                        name="title"
                        render ={({field})=>(
                              <FormItem >
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder='e.g Advance Web Development' {...field} />
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

export default TitleForm