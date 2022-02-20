import React from 'react'

export default function HeaderPost() {
  return (
    <div className="header_post flex items-center mt-5">
      <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-10 w-10 rounded-full cursor-pointer' />
      <span className=' flex flex-col ml-3'>
        <p className=' font-medium hover:underline hover:underline-offset-2 cursor-pointer'>Muhammad Fariz Baiquni</p>
        <span className=' flex text-sm text-gray-500 hover:underline hover:underline-offset-2 cursor-pointer'>
          <p>February 20</p> 
          <p>at</p> 
          <p>10:00 PM</p>
        </span>
      </span>
    </div>
  )
}