import React from 'react'
import { SkeletonCard } from './SkeletionCard'

const SkeletonCards = () => {
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <SkeletonCard/>
        <SkeletonCard/>
        <SkeletonCard/>
        <SkeletonCard/>
    </div>
  )
}

export default SkeletonCards