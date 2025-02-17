import React from 'react'
import Form from "./components/Form";
import Image from 'next/image';

export default function LoginForm() {
  return (
    <div className="w-full h-auto p-4 md:px-0 lg:px-8 py-10 lg:py-14 grid grid-cols-1 md:grid-cols-2 bg-richblack-900 text-richblack-200">
      <div className='w-full flex justify-center items-center'>
        <Form/>
      </div>
      <div className='hidden w-full md:flex justify-center items-center'>
        <div className='relative'>
            <Image
                src={'/assets/Images/frame.png'}
                alt="Sign-In-Banner"
                width={400}
                height={400}
                className='w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-cover'
            />
            <Image
                src={'/assets/Images/login.webp'}
                alt="Sign-In-Banner"
                width={450}
                height={450}
                className='w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] absolute top-[-20px] left-[-20px] object-cover'
            />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
    title: "Login | Study Notion",
    description: "login Page",
};