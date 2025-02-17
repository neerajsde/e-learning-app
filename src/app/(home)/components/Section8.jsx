import RatingAndReviews from '@/components/common/RatingAndReviews'
import SkeletonCards from '@/components/common/SkeletonCards'
import React, { Suspense } from 'react'

const Section8 = () => {
  return (
    <div className='w-full flex flex-col mt-10 lg:mt-20 gap-5 lg:gap-10'>
        <h2 className='text-center text-xl md:text-2xl lg:text-3xl text-richblack-25'>Reviews from other learners</h2>
        <Suspense fallback={<SkeletonCards/>}>
            <RatingAndReviews/>
        </Suspense>
    </div>
  )
}

export default Section8