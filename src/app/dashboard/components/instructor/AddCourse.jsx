import React, { useEffect, useState } from 'react'
import Stepper from '../common/Stepper'
import CourseInfo from './CourseInfo';
import CouseBuilder from './CouseBuilder';
import Publish from './Publish';
import Lecture from './Lecture';
import apiHandler from '@/utils/apiHandler';
import { useSearchParams } from 'next/navigation';
import MdLoader from '@/components/spinner/MdLoader';

const stepsData = [
    { id: 1, title: "Course Information", isFilled: false, click:false },
    { id: 2, title: "Course Builder", isFilled: false, click:false },
    { id: 3, title: "Publish", isFilled: false, click:false },
];

const AddCourse = ({getAllCourses}) => {
    const searchParams = useSearchParams();
    const [steps, setSteps] = useState(stepsData);
    const [currStep, setCurrStep] = useState(1);
    const [courseId, setCourseId] = useState(0); // will update cousre id of 0
    const [lectureTabOpen, setLectureTabOpen] = useState({isActive: false, isEdit: false, data:null});
    const [sections, setSections] = useState(null);
    const [vaildUser, setVaildUser] = useState({flag: true, msg: ""});
    const [isLoading, setIsLoading] = useState(false);

    async function getCourseDetailsWithId(courseId){
        setIsLoading(true);
        if(!courseId || courseId === "undefined" || courseId == "0"){ 
            setVaildUser({flag: false, msg: "Invalid Course Id"});
        }
        else{
            const response = await apiHandler(`/course/cd/${courseId}`, "GET", true);
            if(response.success){
                if(response.data.course.isPublish){
                    setSteps((prevState) => 
                        prevState.map((step, index) => 
                            index === 2 ? { ...step, isFilled: true } : step
                        )
                    );
                }
            }
            else{
                setVaildUser({flag: false, msg: response.message});
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if(searchParams.get("course") === "edit"){
            const id = searchParams.get("cid");
            setCourseId(id);
            getCourseDetailsWithId(id);
        }
    },[searchParams])

  async function getSectionData(){
    const res = await apiHandler(`/course/section?id=${courseId}`, "GET", true);
    if(res.success){
      setSections(res.data);
    }
  }
  useEffect(() => {
    if(courseId){
      getSectionData();
    }
  },[courseId]);

  useEffect(() => {
    if(sections && (sections.length >= 5)){
        setSteps((prevState) => 
            prevState.map((step, index) => 
                index === 1 ? { ...step, isFilled: true } : step
            )
        ); 
        if(!steps[1].click){
            setCurrStep(3); 
            setSteps((prevState) => 
                prevState.map((step, index) => 
                    index === 1 ? { ...step, click: true } : step
                )
            ); 
        }
    }
  },[sections]);

  if(isLoading){
    return (
        <div className='w-full h-[80vh] flex justify-center items-center'>
            <MdLoader/>
        </div>
    )
  }

  if(!vaildUser.flag){
    return (
        <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-1">
            <h2 className="text-lg font-semibold text-richblack-50">Error</h2>
            <p className='text-base text-richblack-300'>{vaildUser.msg}</p>
        </div>
    )
  }

  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-[auto_350px] gap-4'>
        {
            lectureTabOpen.isActive && (
                <div className='w-full h-screen fixed top-0 left-0 bg-richblack-700 bg-opacity-35 flex justify-center items-center z-[999999] backdrop-blur'>
                    <Lecture
                        data={lectureTabOpen}
                        setLectureTabOpen={setLectureTabOpen}
                        getSectionData={getSectionData}
                    />
                </div>
            )
        }
        <div className='w-full flex flex-col gap-8'>
            <Stepper steps={steps} currentStep={currStep} setCurrStep={setCurrStep}/>
            <div className='w-full bg-richblack-800 p-4 mb-20 rounded-lg text-white'>
                {currStep === 1 && (<CourseInfo steps={steps} setSteps={setSteps} setCurrStep={setCurrStep} setCourseId={setCourseId}/>)}
                {currStep === 2 && (<CouseBuilder sections={sections} setCurrStep={setCurrStep} getSectionData={getSectionData} courseId={courseId} setLectureTabOpen={setLectureTabOpen}/>)}
                {currStep === 3 && (<Publish courseId={courseId} setSteps={setSteps} getAllCourses={getAllCourses}/>)}
            </div>
        </div>

        <div className="w-full text-gray-100">
            <div className='bg-richblack-800 p-4 rounded-xl shadow-lg'>
                <h2 className="text-lg font-semibold flex items-center">
                    <span className="">⚡</span> Course Upload Tips
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                    <li>• Set the Course Price option or make it free.</li>
                    <li>• Standard size for the course thumbnail is 1024×576.</li>
                    <li>• Video section controls the course overview video.</li>
                    <li>• Course Builder is where you create & organize a course.</li>
                    <li>• Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
                    <li>• Information from the Additional Data section shows up on the course single page.</li>
                    <li>• Make Announcements to notify any important notes to all enrolled students at once.</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default AddCourse