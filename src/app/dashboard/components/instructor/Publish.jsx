import MdLoader from "@/components/spinner/MdLoader";
import { toast } from "@/hooks/use-toast";
import apiHandler from "@/utils/apiHandler";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Publish = ({courseId, setSteps, getAllCourses}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkBtn, setCheckBtn] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  async function getCourseDetailsWithId(courseId){
    const response = await apiHandler(`/course/cd/${courseId}`, "GET", true);
    if(response.success){
        if(response.data.course.isPublish){
          setCheckBtn(true);
          setIsPublished(true);
        }
    }
  }

  useEffect(() => {
    if(searchParams.get("course") === "edit"){
        const id = searchParams.get("cid");
        getCourseDetailsWithId(id);
    }
  },[searchParams])

  function backHandler(){
    const tab = searchParams.get("tab");
    router.replace(`/dashboard?tab=${tab}`);
  }

  async function saveAndPublishHandler(){
    if(!checkBtn && !isPublished){
      toast({
        title: "⚠️ Warning !Please make public",
        description: "Saved as a Draft",
      });
      return;
    }
    if(!checkBtn && isPublished){
      toast({
        title: "⚠️ Warning !Please select make private",
        description: "Save as a Darft",
      });
      return;
    }
    setLoading(true);
    let response;
    if(isPublished){
      response = await apiHandler(`/course/unpublish/${courseId}`, "PUT", true);
      if(response.success){
        setSteps((prevState) => {
          const curr = [...prevState];
          curr[2].isFilled = false;
          return curr;
        });
        setIsPublished(false);
      }
    }
    else{
      response = await apiHandler(`/course/publish/${courseId}`, "PUT", true);
      if(response.success){
        setSteps((prevState) => {
          const curr = [...prevState];
          curr[2].isFilled = true;
          return curr;
        });
        const tab = searchParams.get("tab");
        router.replace(`/dashboard?tab=${tab}`);
      }
    }
    if(response.success){
      getAllCourses();
    }
    toast({
      title: response.success ? "Success" :  "Uh oh! Something went wrong.",
      description: response.message || "Failed to authenticate. Please try again.",
    });
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="w-full text-2xl font-semibold text-richblack-50">
        Publish Settings
      </h2>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="publicCourse"
          checked={checkBtn} // ✅ Correct way to bind state
          onChange={(e) => setCheckBtn(e.target.checked)} // ✅ Correct way to update state
          className="w-5 h-5 text-blue-600 bg-richblack-800 border-gray-300 rounded-md cursor-pointer"
        />
        <label
          htmlFor="publicCourse"
          className="text-richblack-300 text-sm cursor-pointer"
        >
          Make this Course {isPublished ? "Private" : "Public"}
        </label>
      </div>

      <div className="w-full flex items-center justify-end gap-4 ">
        <button
          type="button"
          onClick={backHandler}
          className="px-4 h-10 flex items-center justify-center gap-1 bg-richblack-800 border border-richblack-500 text-richblack-200 rounded-md text-base font-semibold"
        >
          Back
        </button>

        <button
          type="button"
          onClick={saveAndPublishHandler}
          className="w-40 h-10 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in"
        >
          {loading ? (<MdLoader/>) : isPublished ? "Hide Course" : "Save & Publish"}
        </button>
      </div>
    </div>
  );
};

export default Publish;
