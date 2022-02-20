import React from 'react'

export default function Groups() {
  return (
    <div className=' flex flex-col border-b border-gray-400'>
      <span className=' flex items-center justify-between'>
        <span className=' flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <p className=' font-medium ml-2 cursor-pointer hover:underline'>Groups</p>
          <p className=' ml-2 text-gray-500 font-thin'>Suggested for you</p>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 justify-end cursor-pointer" viewBox="0 0 20 20" fill="#343a40">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>

      <img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="group" className=' rounded-lg mt-3 mx-1 ' />

      <p className=' line-clamp-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel nisi beatae maxime delectus molestiae, animi officia quidem reprehenderit adipisci vitae sapiente molestias hic debitis nam id quo voluptate reiciendis et.  </p>

      <span className=' flex text-sm text-gray-700 mt-1'>
        <p className=' mr-2'>100k members</p>
        <p>5+ posts per day</p>
      </span>

      <button className=' py-1 font-semibold mt-2 rounded-md hover:bg-gray-300 my-3'>Join Group</button>
    </div>
  )
}