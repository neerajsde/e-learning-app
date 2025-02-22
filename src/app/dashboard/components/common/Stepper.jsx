import React from "react";
import { TiTick } from "react-icons/ti";

const Stepper = ({ steps, currentStep, setCurrStep }) => {
  return (
    <div className="w-full relative flex items-center justify-around gap-6">
        {/* Dashed line */}
        <div className="w-8/12 absolute top-5 border-t-2 border-dashed border-richblack-500 z-10"></div>

      {steps.map((step, index) => (
        <div key={`7bH32VJH_767JHGG_${index}${step.id}`} className="w-full flex flex-col items-center justify-center gap-2">
            <div onClick={() => setCurrStep(step.id)} className={`w-11 h-11 z-50 border-[1.5px] rounded-full flex justify-center items-center text-xl font-bold text-richblack-300 cursor-pointer transition-all duration-200 ease-in ${
            step.id === currentStep ? 
                ' bg-yellow-800 border-yellow-50 text-yellow-100' :
                'hover:border-yellow-50 border-richblack-500 bg-richblack-700'
            }
            ${step.isFilled && 'bg-yellow-100 border-yellow-50 text-richblack-800'}
            `}>
                {step.isFilled ? (<TiTick className="text-3xl"/>) : (step.id)}
            </div>
            <span className="text-base font-normal text-richblack-200">{step.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
