import Link from 'next/link';
import Logo1 from '../../../../public/assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../../public/assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../../public/assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../../public/assets/TimeLineLogo/Logo4.svg';
import Image from 'next/image';

const icons = [Logo1, Logo2, Logo3, Logo4];

const Section5 = () => {
  return (
    <div className="w-full flex flex-col gap-10 mb-10">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start gap-4 lg:gap-0">
        <div className="w-full md:w-[300px] lg:w-[500px]">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-richblack-900">
            Get the skills you need for a{' '}
            <span className="gradient-text">job that is in demand.</span>
          </h2>
        </div>
        <div className="w-full md:w-[300px] lg:w-[500px] flex flex-col gap-10 items-start">
          <p className="text-sm md:text-base text-richblack-600 font-medium">
            The modern StudyNotion dictates its own terms. Today, to be a
            competitive specialist requires more than professional skills.
          </p>
          <Link href="/" className="yellow-btn">
            Learn More
          </Link>
        </div>
      </div>

      {/* Icons & Content Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
        <div className="w-full md:w-[300px] lg:w-[350px] flex justify-start">
            <div className="w-[50px] flex flex-col items-center gap-10">
                {icons.map((icon, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                        {/* Dashed Line: Show for all except first */}
                        {index > 0 && <div className="absolute -top-8 h-6 border-l-2 border-dashed border-gray-400" />}
                        
                        {/* SVG Icon */}
                        <div className='w-[50px] h-[50px] flex justify-center items-center bg-white shadow rounded-full'>
                            <Image src={icon} alt={`Logo ${index + 1}`} width={20} height={20} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full pl-4 flex flex-col items-center gap-10 md:gap-11 lg:gap-10">
                <div className='w-full flex flex-col md:pt-1'>
                    <h3 className='text-base md:text-lg font-semibold text-richblack-900'>Leadership</h3>
                    <p className='text-xs lg:text-sm text-richblack-500'>Fully committed to the success company</p>
                </div>
                <div className='w-full flex flex-col'>
                    <h3 className='text-base md:text-lg font-semibold text-richblack-900'>Responsibility</h3>
                    <p className='text-xs lg:text-sm text-richblack-500'>Students will always be our top priority</p>
                </div>
                <div className='w-full flex flex-col'>
                    <h3 className='text-base md:text-lg font-semibold text-richblack-900'>Flexibility</h3>
                    <p className='text-xs lg:text-sm text-richblack-500'>The ability to switch is an important skills</p>
                </div>
                <div className='w-full flex flex-col'>
                    <h3 className='text-base md:text-lg font-semibold text-richblack-900'>Solve the problem</h3>
                    <p className='text-xs lg:text-sm text-richblack-500'>Code your way to a solution</p>
                </div>
            </div>
        </div>
        <div className="w-full md:w-[350px] lg:w-[650px] shadow-[-32px_1px_23px_-28.5px_#41b2d8,32px_1px_26.5px_-28.5px_#41b2d8] relative">
            <Image
                src={'/assets/Images/TimelineImage.png'}
                alt='Timeline Image'
                width={650}
                height={450}
                className='w-full h-auto lg:h-[450px] object-cover shadow-[12px_12px_0_0_#fff]'
            />
            <div className='w-11/12 lg:w-[70%] h-[100px] px-4 md:px-6 lg:px-10 flex justify-around md:justify-between items-center bg-green-900 absolute -bottom-10 left-3 lg:left-24'>
                <div className='flex flex-col md:flex-row items-center gap-0 md:gap-4'>
                    <h2 className='text-lg md:text-xl lg:text-3xl font-semibold text-white'>10</h2>
                    <div className='flex flex-col items-center text-sm text-green-400'>
                        <span>YEARS</span>
                        <span>EXPERIENCES</span>
                    </div>
                </div>
                <div className='w-[1px] h-[80%] bg-richblack-300'></div>
                <div className='flex flex-col md:flex-row items-center gap-0 md:gap-4'>
                    <h2 className='text-lg md:text-xl lg:text-3xl font-semibold text-white'>250</h2>
                    <div className='flex flex-col items-center text-sm text-green-400'>
                        <span>TYPES OF</span>
                        <span>COURSES</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Section5;
