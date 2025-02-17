import Link from 'next/link'
import React from 'react'
import { GoDotFill } from "react-icons/go";

const CategoryInfo = ({data}) => {
  return (
    <div className='w-full text-white bg-richblack-800 flex flex-col md:flex-row justify-between p-4 md:p-6 lg:px-10 lg:py-8 gap-4 md:gap-6 lg:gap-8'>
        <div className='w-full flex flex-col gap-4'>
            <div className='w-full flex justify-start items-center gap-1 md:gap-2 text-richblack-300 text-base md:text-lg'>
                <Link href='/'>Home</Link>
                <span>/</span>
                <Link href='/catalog'>Catalog</Link>
                <span>/</span>
                <span className='text-yellow-100'>{data.name}</span>
            </div>
            <h1 className=' capitalize text-2xl text-richblack-25'>{data.name}</h1>
            <div className='text-richblack-300 text-sm max-sm:text-justify'>{data.description}</div>
        </div>
        <div className='w-[300px] flex flex-col gap-2'>
            <h2 className='text-xl text-richblack-25 font-semibold'>Related Resourse</h2>
            <ul className='w-full flex flex-col text-richblack-300'>
                <li className='flex items-center'><GoDotFill className='text-sm'/> Doc {data.name}</li>
                <li className='flex items-center'><GoDotFill className='text-sm'/> Cheatsheets</li>
                <li className='flex items-center'><GoDotFill className='text-sm'/> Articales</li>
                <li className='flex items-center'><GoDotFill className='text-sm'/> Company Fourm</li>
                <li className='flex items-center'><GoDotFill className='text-sm'/> Projects</li>
            </ul>
        </div>
    </div>
  )
}

export default CategoryInfo