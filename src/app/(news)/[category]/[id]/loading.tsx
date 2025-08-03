import React from 'react'
import Loader from '@/components/Loader'

const loading = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-maroon-100 dark:bg-maroon-800'>
      <Loader />
    </div>
  )
}

export default loading