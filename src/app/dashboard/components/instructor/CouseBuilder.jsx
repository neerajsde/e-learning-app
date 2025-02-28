import MdLoader from '@/components/spinner/MdLoader';
import apiHandler from '@/utils/apiHandler';
import React, { useEffect, useState } from 'react';
import { MdAddCircleOutline } from "react-icons/md";
import CourseSection from './CourseSection';
import { toast } from '@/hooks/use-toast';

const CouseBuilder = ({sections, getSectionData, setCurrStep, courseId, setLectureTabOpen}) => {
  const [newSection, setNewSection] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(courseId){
      getSectionData();
    }
  },[courseId]);

  const createSection = async(e) => {
    e.preventDefault();
    if(courseId === 0) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please fill Course Information.",
      });
      return;
    }
    setLoading(true);
    const payload = {
      courseId: courseId,
      sectionName: newSection
    }
    const res = await apiHandler("/course/section", "POST", true, payload);
    toast({
      title: res.success ? "Success" :  "Uh oh! Something went wrong.",
      description: res.message || "Failed to authenticate. Please try again.",
    });
    if(res.success){
      setNewSection("");
      await getSectionData();
    }
    setLoading(false);
  }

  function nextMoveHandler(){
    if(sections && (sections.length >= 5)){
      setCurrStep(3);
    }
    else{
      alert('Please add minimum 5 sections.')
    }
  }

  return (
    <div className='w-full flex flex-col'>
      <h2 className='text-xl text-richblack-25'>Course Builder</h2>

      {sections && sections.length > 0 &&(<div className='w-full pb-4'>
        <CourseSection data={sections} getSectionData={getSectionData} setLectureTabOpen={setLectureTabOpen} />
      </div>)}

      <form onSubmit={createSection} className="w-full flex flex-col py-2 gap-4">
        <input
          type="text"
          name="section"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          required
          placeholder="Add a section to build your course"
          className="w-full h-12 bg-richblack-700 border border-richblack-600 text-white rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        
        <div className="w-full flex items-center justify-between gap-4 ">
          <button
            type='submit'
            className='w-40 h-10 py-2 px-2 flex items-center justify-center border border-yellow-100 text-yellow-100 text-base font-semibold gap-1 rounded-lg transition-all duration-200 ease-in hover:bg-yellow-100 hover:text-richblack-800'
          >
            {loading ? (<MdLoader/>) : (<span className='flex items-center justify-center'><MdAddCircleOutline className='text-lg'/> Create Section</span>)}
          </button>

          <button 
            type='button'
            onClick={nextMoveHandler}
            className="px-4 h-10 flex items-center justify-center gap-1 bg-yellow-200 border border-yellow-200 text-richblack-900 rounded-md text-base font-semibold hover:bg-yellow-300 transition-all duration-200 ease-in"
          >
            Save & Next
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default CouseBuilder