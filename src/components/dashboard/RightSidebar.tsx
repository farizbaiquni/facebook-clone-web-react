import React from 'react'
import Contacts from '../rightSidebar/Contacts'
import GroupConversations from '../rightSidebar/GroupConversations'
import Groups from '../rightSidebar/Groups'

export default function RightSidebar() {
  return (
    <div className='right-side flex flex-col text-left mr-3 w-3000'>
    
      <Groups />
      <Contacts />
      <GroupConversations />

      <div className=" h-12 w-12 rounded-full fixed bottom-5 right-5 shadow shadow-lg shadow-gray-400">
        <span className=" flex justify-center items-center w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>  
        </span>
      </div>

    </div>
  )
}