import Image from 'next/image'
import Link from 'next/link'

const Section7 = () => {
  return (
    <div className='w-full flex flex-col md:flex-row justify-around items-center gap-8 mt-10 md:gap-0'>
        <div className='w-11/12 md:w-[300px] lg:w-[500px] h-auto md:h-[270px] lg:h-[450px] shadow-[-12px_-12px_0_0_#ffffff]'>
            <Image
                src={'/assets/Images/Instructor.png'}
                alt='Instructor-Img'
                width={500}
                height={500}
                className='w-full h-full object-cover'
            />
        </div>
        <div className='w-full md:w-[300px] lg:w-[500px] flex flex-col gap-2 md:gap-4'>
            <h2 className='text-xl md:text-2xl lg:text-3xl font-semibold text-richblack-50'>Become an <span className='gradient-text'>instructor</span></h2>
            <p className='text-sm md:text-base text-richblack-300'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
            <div className=' w-full flex justify-start mt-8'>
                <Link href='/' className='yellow-btn'>Start Teaching Today</Link>
            </div>
        </div>
    </div>
  )
}

export default Section7