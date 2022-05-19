import React from 'react'

export default function InputComment() {
  return (
    <div className=' flex mt-3 py-2'>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
        <input type="text" placeholder='Write a comment...' className=' flex-1 px-2 focus:outline-none bg-gray-100 rounded-xl' />
    </div>
  )
}