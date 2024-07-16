'use client'
import React from 'react'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation'
import {
Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import toast from 'react-hot-toast'


const formSchema = z.object({
    title:z.string().min(1, {
        message:"Title is required"
    })
})


const CreatePage = () => {
const router = useRouter();
    const form = useForm<z.infer <typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:  {
            title:""
        },
    })

    const {isSubmitting , isValid} = form.formState;
    const onSubmit=async(values:z.infer <typeof formSchema>)=>{
        try {
            const response = await axios.post('/api/courses',values)
            router.push(`/teacher/courses/${response.data.id}`)
            toast.success("Course created")
        } catch (error) {
         toast.error('Something went wrong')
        }
    }

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
        <div className="">
            <h1>Name your Course</h1>
            <p className='text-sm text-slate-600'>What would you like to name your course</p>
            <Form {...form}>
                <form className='space-y-8 mt-8' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name="title"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                                <Input disabled={isSubmitting} placeholder="e.g. Advanced Web Development" {...field} />
                            </FormControl>
                            <FormDescription>
                                What will you teach in this course
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href='/teacher/courses'>
                        <Button variant={'ghost'} type='button'>
                            Cancel
                        </Button>
                        </Link>
                        <Button disabled={!isValid || isSubmitting} variant={'ghost'} type='submit'>
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default CreatePage