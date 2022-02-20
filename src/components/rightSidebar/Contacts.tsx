import React from 'react'

export default function Contacts() {
  return (
    <div className=' flex flex-col mt-10 border-y border-gray-400 py-3'>

      <span className=' flex justify-between'>
        <p className=' font-semibold'>Contacts</p>

        <span className=' flex'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </span>

      </span>

      <span className=' flex items-center mt-3 cursor-pointer py-2'>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="profile contact" className=' h-8 w-8 rounded-full' />
        <p className=' ml-2 font-semibold'>Anonymous</p>
      </span>
    </div>
  )
}