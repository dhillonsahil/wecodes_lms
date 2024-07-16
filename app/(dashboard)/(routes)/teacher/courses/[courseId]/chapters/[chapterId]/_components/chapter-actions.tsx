'use client'
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Chapter } from "@prisma/client";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  disabled: boolean;
}

const ChapterActions = ({
  chapterId,
  isPublished,
  courseId,
  disabled,
}: ChapterActionsProps) => {
    const router=useRouter();
    const [isLoading,setIsLoading]=useState(false)

    const onDelete = async()=>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success('Chapter deleted');
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            toast.error('Something went wrong')
        }finally{
            setIsLoading(false)
        }
    }

    const onClick = async()=>{
      try {
        
        setIsLoading(true)
        if(isPublished){
          await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
          toast.success("Chapter unpublished")
        }else {
          await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
          toast.success("Chapter published")
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

export default ChapterActions;
