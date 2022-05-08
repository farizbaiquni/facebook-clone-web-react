import React, { memo, useState } from 'react'
import Story from './Story'

function Stories() {

  const[stories, setStories] = useState([1, 2, 3, 4])

  return (
    <div className="story grid grid-cols-5 grid-rows-story gap-2">

      <div className=' relative'>
        <img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="" className=' w-full h-3/4 rounded-md object-cover absolute' />
        <h1 className=' absolute text-slate-800 w-full text-center bottom-1 text-sm font-semibold break-all px-2'>Create story</h1>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' absolute h-10 w-10 rounded-full border-4 border-white left-0 right-0 mx-auto bottom-8' />
      </div>

      {
        stories.map((value, index) => 
         (stories.length === (index + 1)) ? <LastStory /> : <Story />
        )
      }
      
    </div>
  )
}

const LastStory = () => (
  <div className=' relative opacity-95 hover:opacity-100'>
    <img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="" className=' w-full h-full rounded-md object-cover absolute' />
    <h1 className=' absolute text-white w-full text-center bottom-1 text-sm font-semibold break-all px-2'>Muhammad Fariz Baiquni</h1>
    <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' absolute left-2 top-2 h-10 w-10 rounded-full border-4 border-blue-600' />
    <svg xmlns="http://www.w3.org/2000/svg" className=" bg-white h-10 w-10 p-2 absolute rounded-full top-0 bottom-0 m-auto left-24" fill="none" viewBox="0 0 24 24" stroke="gray">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </div>
)

export default memo(Stories)