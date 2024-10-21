import React from 'react'
import { Skeleton } from './ui/skeleton'

const SkeletonCards = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <Skeleton className='shadow-lg flex justify-center w-[250px] h-[250px]'/>
      <Skeleton className='shadow-lg flex justify-center w-[250px] h-[250px]'/>
      <Skeleton className='shadow-lg flex justify-center w-[250px] h-[250px]'/>
      <div className='h-[35px]'> </div>
    </div>
  )
}

export default SkeletonCards