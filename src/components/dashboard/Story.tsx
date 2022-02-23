import React from 'react'

export default function Story() {
  return (
      <div className=' relative'>
        <img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="" className=' w-full h-full rounded-md object-cover absolute' />
        <h1 className=' absolute text-white w-full text-center bottom-1 text-sm font-semibold break-all px-2'>Muhammad Fariz Baiquni</h1>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' absolute left-2 top-2 h-10 w-10 rounded-full border-4 border-blue-600' />
      </div>
  )
}