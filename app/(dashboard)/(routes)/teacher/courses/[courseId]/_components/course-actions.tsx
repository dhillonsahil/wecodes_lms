'use client'
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/user-confetti-store";

interface CourseActionProps {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}

const CourseAction = ({
  isPublished,
  courseId,
  disabled,
}: CourseActionProps) => {
    const router=useRouter();
    const [isLoading,setIsLoading]=useState(false)

    const onDelete = async()=>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success('Course deleted');
            router.push(`/teacher/courses`);
        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setIsLoading(false)
        }
    }

    const confetti = useConfettiStore();
    const onClick = async()=>{
      try {
        
        setIsLoading(true)
        if(isPublished){
          await axios.patch(`/api/courses/${courseId}/unpublish`);
          toast.success("Course unpublished")
          router.refresh()
        }else {
          await axios.patch(`/api/courses/${courseId}/publish`);
          toast.success("Course published")
          confetti.onOpen();
          router.refresh()
        }
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong")
      }finally{
        setIsLoading(false);
      }
    }

  return <div className="flex items-center gap-x-2">
    <Button onClick={onClick}  disabled={disabled || isLoading} variant={'outline'}  size={'sm'}  >
        {isPublished ?"Unpublish":"Publish"}
    </Button>

    <ConfirmModal onConfirm={onDelete}>
    <Button disabled={isLoading}  size={'sm'}  >
        <Trash />
    </Button>
    </ConfirmModal>
  </div>;
};

export default CourseAction;
