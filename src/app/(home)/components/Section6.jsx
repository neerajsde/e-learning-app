import Image from 'next/image';
import React from 'react';
import knowYourProgressImg from '../../../../public/assets/Images/Know_your_progress.svg';
import compareWithOthersImg from '../../../../public/assets/Images/Compare_with_others.svg';
import planYourLessonImg from '../../../../public/assets/Images/Plan_your_lessons.svg';
import Link from 'next/link';

const images = [
  { src: knowYourProgressImg, alt: 'Know Your Progress', position: 'top-0 left-0' },
  { src: compareWithOthersImg, alt: 'Compare With Others', position: ' -top-6 md:top-0 left-0 md:left-[200px] lg:left-[350px]' },
  { src: planYourLessonImg, alt: 'Plan Your Lessons', position: '-top-20 md:top-0 right-0' },
];

const Section6 = () => {
  return (
    <div className="w-full flex flex-col items-center mt-20">
      <div className="w-full lg:w-[700px] flex flex-col items-center md:text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-richblack-900">
          Your swiss knife for <span className="gradient-text">learning any language</span>
        </h2>
        <p className="text-sm text-richblack-500 mt-2">
          Using Spin makes learning multiple languages easy. With 20+ languages, realistic voice-over, progress tracking, custom schedules, and more.
        </p>
      </div>
      <div className="relative w-full h-auto flex flex-col md:h-[450px] mt-10">
        {images.map(({ src, alt, position }, index) => (
          <Image
            key={index}
            src={src}
            alt={alt}
            width={400}
            height={450}
            className={`relative w-full h-auto md:w-[350px] lg:w-[450px] md:absolute ${position} object-cover`}
          />
        ))}
      </div>
      <div className='w-full flex justify-center items-center -mt-20 -md:mt-10 lg:mt-10'>
        <Link href='/' className='yellow-btn'>Learn More</Link>
      </div>
    </div>
  );
};

export default Section6;
