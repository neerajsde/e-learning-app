"use client"
import apiHandler from '@/utils/apiHandler'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { IoAddCircleOutline } from "react-icons/io5";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdError } from "react-icons/md";
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";
import AddCourse from './AddCourse';
import EditCourse from './EditCourse';
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const Course = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [courses, setCourses] = useState(null);
    const getAllCourses = async() => {
        const response = await apiHandler('/dashboard/instructor/courses', "GET", true);
        if(response.success){
            setCourses(response.data);
        }
    }
    useEffect(() => {
        getAllCourses();
    },[]);

    const handleClick = (link) => {
        const params = new URLSearchParams(searchParams);
        params.set("course", link);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleClickNavigate = (id) => {
        const params = new URLSearchParams(searchParams);
        params.set("course", "edit");
        params.set("cid", id);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if(searchParams.get("course") === "add"){
        return (<AddCourse/>)
    }

    if(searchParams.get("course") === "edit"){
        return (<EditCourse/>)
    }

  return (
    <div className='w-full flex flex-col gap-6 font-inter pb-20'>
        <div className='w-full flex justify-between items-center'>
            <h2 className='text-2xl text-richblack-50 font-semibold'>All Course</h2>
            <button onClick={() => handleClick("add")} className='w-[100px] text-richblack-800 bg-yellow-100 py-2 flex justify-center items-center gap-1 font-semibold rounded-sm border-yellow-100 text-base transition-all duration-200 ease-in hover:bg-yellow-200'>
                <IoAddCircleOutline className='text-lg'/>New
            </button>
        </div>

        {
            courses ?
            (
                <table className='w-full text-richblack-200'>
                    <thead className='border border-richblack-800 text-richblack-200'>
                        <td className='border-r border-richblack-800 py-2 px-2'>COURSES</td>
                        <td className='border-r border-richblack-800 px-2 text-center'>DURATION</td>
                        <td className='border-r border-richblack-800 px-2 text-center'>PRICE</td>
                        <td className='border-r border-richblack-800 px-2 text-center'>ACTIONS</td>
                    </thead>
                    <tbody className='border border-richblack-800'>
                        {
                            courses.map((item, index) => (
                                <tr key={`j76dg8GD_i${index}`} className=''>
                                    <td className='w-full flex justify-start py-6 px-2 gap-4'>
                                        <Link href={`/courses/${item.slugUrl}`}>
                                            <Image
                                                src={item.thumbnail}
                                                alt='Thumbnail'
                                                width={200}
                                                height={100}
                                                className=' rounded-md object-cover'
                                            />
                                        </Link>
                                        <div className='max-w-[400px] w-full flex flex-col justify-start'>
                                            <span className='text-base text-richblack-25'>{item.name}</span>
                                            <span className='text-sm'>{item.courseDesc}</span>
                                            <span className='text-sm text-richblack-100'>Created: {item.created_At}</span>
                                            <span className={`w-full flex mt-2 justify-start text-xs font-semibold'}`}>
                                                {
                                                    item.isPublish 
                                                    ? 
                                                        (<span className='flex justify-center items-center gap-1 text-green-500 bg-green-300 bg-opacity-35 py-1 px-2 rounded-2xl'><VscVerifiedFilled/> Published</span>) 
                                                    : 
                                                        (<span className='flex justify-center items-center gap-1 text-red-500 bg-red-300 bg-opacity-35 py-1 px-2 rounded-2xl'><MdError/> Drafted</span>)
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td className='text-center text-richblack-100'>{item.duration}</td>
                                    <td className='text-center text-richblack-100'>{item.price}</td>
                                    <td className='text-center'>
                                        <button 
                                            onClick={() => handleClickNavigate(item.id)} 
                                            className='p-2 rounded-md text-richblack-300 hover:text-richblack-50 hover:bg-richblack-700 transition duration-200'
                                        >
                                            <MdEdit className='text-lg'/>
                                        </button>
                                        <button 
                                            className='p-2 rounded-md text-red-400 hover:text-red-600 hover:bg-red-200 transition duration-200'
                                        >
                                            <RiDeleteBinLine className='text-lg'/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            ) :
            (
                <div className='w-full h-[200px] flex justify-center items-center text-xl text-richblack-300'>EMPTY COURSES</div>
            )
        }
    </div>
  )
}

export default Course