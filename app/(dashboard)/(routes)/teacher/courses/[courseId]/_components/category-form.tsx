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
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';


interface CategoryFormProps{
    initialData : Course
    courseId:string,
    options :{ label:string,value:string  }[]
}

const formSchema = z.object({
    categoryId:z.string().min(1)
})
const CategoryForm = ({initialData,courseId,options,}:CategoryFormProps) => {
   
    
    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:  {
            categoryId : initialData.categoryId || ""
        }
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
    const toggleEdit = () => setIsEditing(!isEditing);
    const selectedOption = options.find((option)=> option.value===initialData.categoryId)

    console.log("Options verify ",options)

  return (
    <div className='mt-5 bg-slate-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between">
            Course Category
            <Button onClick={toggleEdit} variant={'ghost'}>
                {isEditing && (
                    <>Cancel</>
                )}
                {
                    !isEditing && (
                        <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Category
                        </>
                    ) 
                }
                
            </Button>
        </div>
        {
            !isEditing && (
                <p className={cn('text-sm mt-2',!initialData.categoryId && "text-slate-500 italic")}>
                    {selectedOption?.label || 'No Category'}
                </p>
            )
        }
        {
            isEditing && (
                <Form {...form} >
                    <form className='space-y-4 mt-4' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField 
                        control={form.control}
                        name="categoryId"
                        render ={({field})=>(
                              <FormItem >
                                <FormControl>
                                    
                                    <Combobox options={...options} {...field} />
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

export default CategoryForm