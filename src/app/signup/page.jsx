import React from 'react';
import Form from "./components/Form";
import Image from 'next/image';

const signup = () => {
  return (
    <div className="w-full relative h-auto p-4 lg:p-8 grid grid-cols-1 md:grid-cols-2 bg-richblack-900 text-richblack-200">
      <div className='w-full flex justify-center items-center'>
        <Form/>
      </div>
      <div className='hidden w-full md:flex justify-center items-start lg:items-center md:py-8 lg:py-0'>
        <div className='relative'>
            <Image
                src={'/assets/Images/frame.png'}
                alt="Sign-In-Banner"
                width={400}
                height={400}
                className='w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-cover'
            />
            <Image
                src={'/assets/Images/signup.webp'}
                alt="Sign-In-Banner"
                width={450}
                height={450}
                className='w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] absolute top-[-20px] left-[-20px] object-cover'
            />
        </div>
      </div>
    </div>
  )
}

export default signup;

export const metadata = {
  title: "Sign up | Study Notion",
  description: "sign up Page",
};
