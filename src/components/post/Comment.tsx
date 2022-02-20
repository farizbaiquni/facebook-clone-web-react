import React from 'react'

export default function Comment() {
  return (
    <div className=' flex mt-3'>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
        <span className=' flex flex-col ml-2'>
            <p className=' text-sm font-semibold text-left'>Anonymous</p>
            <p className=' text-left'>This is a comment</p>
            <span className=' flex mt-1'>
                <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Like</p>
                <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Reply</p>
                <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline'>See translation</p>
            </span>
        </span>
        
    </div>
  )
}