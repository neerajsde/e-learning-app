import Link from 'next/link';
import React from 'react';

const Section1 = () => {
  return (
    <div className='w-full flex flex-col-reverse md:flex-col items-center gap-8 mt-10'>
      <div className='w-11/12 max-w-[850px] flex flex-col items-center gap-6'>
        <Link className='black-btn' href='/signup'>
          Become an Instructor
        </Link>
        <div className='w-full flex flex-col gap-4 text-center'>
          <h1 className='text-xl md:text-3xl lg:text-4xl font-semibold text-richblack-50'>
            Empower Your Future with Coding <span className='gradient-text'>Skills</span>
          </h1>
          <p className='text-sm md:text-base text-justify md:text-center text-richblack-200'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
          </p>
        </div>
        <div className='w-full flex justify-center items-center gap-4'>
          <button className='yellow-btn'>Learn More</button>
          <button className='common-btn'>Book a demo</button>
        </div>
      </div>

      {/* Video Section */}
      <div className='w-full flex justify-center items-center mt-5 lg:mt-10'>
        <div className='w-11/12 md:w-[500px] lg:w-[800px] aspect-[16/9] gradiant-effect bg-white relative rounded-xl overflow-hidden shadow-lg'>
          <video
            autoPlay
            muted
            loop
            className='w-full h-full object-cover'
          >
            <source src={'./assets/Images/banner.mp4'} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default Section1;
