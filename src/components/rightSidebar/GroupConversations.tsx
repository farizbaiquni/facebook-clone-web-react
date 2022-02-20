import React from 'react'

export default function GroupConversations() {
  return (
    <div className=" flex flex-col mt-4">
      <p className=' font-semibold'>Group Conversations</p>
      <span className=' flex-1 flex items-center mt-2 cursor-pointer py-2'>
        <img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="profile contact" className=' h-8 w-8 rounded-full' />
        <p className=' ml-2 font-semibold'>Web Programming</p>
      </span>

      <span className=' flex mt-3 items-center group cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 p-1 rounded-full hover:bg-gray-300 group-hover:bg-gray-300 cursor-pointer mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p className=' font-semibold'>Create new group</p>

      </span>
    </div>
  )
}