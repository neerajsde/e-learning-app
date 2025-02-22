import React, { useState } from 'react'
import Stepper from '../common/Stepper'
import CourseInfo from './CourseInfo';
import CouseBuilder from './CouseBuilder';
import Publish from './Publish';

const stepsData = [
    { id: 1, title: "Course Information", isFilled: false },
    { id: 2, title: "Course Builder", isFilled: false },
    { id: 3, title: "Publish", isFilled: false },
];

const AddCourse = () => {
    const [steps, setSteps] = useState(stepsData);
    const [currStep, setCurrStep] = useState(1);
    const [courseId, setCourseId] = useState(0);

  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-[auto_350px] gap-4'>
        <div className='w-full flex flex-col gap-8'>
            <Stepper steps={steps} currentStep={currStep} setCurrStep={setCurrStep}/>
            <div className='w-full bg-richblack-800 p-4 mb-20 rounded-lg text-white'>
                {currStep === 1 && (<CourseInfo setSteps={setSteps} setCurrStep={setCurrStep} setCourseId={setCourseId}/>)}
                {currStep === 2 && (<CouseBuilder courseId={courseId}/>)}
                {currStep === 3 && (<Publish/>)}
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