import React from 'react'

export default function Navbar() {
  return (
    <nav className="navbar flex py-2 px-3 justify-between border-b-2 border-gray-300">
      
      {/* Left side */}
      <div className="left flex items-center mr-3 flex-row-reverse">
        
        <input type="text" id="email-with-icon" className=" peer rounded-r-lg flex-1 appearance-none w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-700 text-base focus:outline-none focus:border-transparent" name="search" placeholder="Search Facebook"/>
        <div className={` hidden peer-focus:block`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 cursor-pointer" viewBox="0 0 20 20" fill="gray">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <span className=" peer-focus:hidden rounded-l-md inline-flex  items-center pl-5 border-t  text-gray-500 shadow-sm text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>  
          </span>
        
        <img src={process.env.PUBLIC_URL + './facebook_icon.png'} alt="" className=' h-10 w-10 cursor-pointer peer-focus:hidden' />

      </div>

      {/* middle */}
      <div className="middle flex items-center mr-3">
        <div className=" flex justify-center w-24 cursor-pointer border-b-4 pb-2 pt-1 border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className=" w-8" viewBox="0 0 20 20" fill="#0466c8">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        
        <div className=" flex justify-center w-24 cursor-pointer border-b-4 pb-2 pt-1 border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className=" w-8" viewBox="0 0 20 20" fill="#0466c8">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>

        <div className=" flex justify-center w-24 cursor-pointer border-b-4 pb-2 pt-1 border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className=" w-8" viewBox="0 0 20 20" fill="#0466c8">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </div>
        
        <div className=" flex justify-center w-24 cursor-pointer border-b-4 pb-2 pt-1 border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className=" w-8" viewBox="0 0 20 20" fill="#0466c8">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>

        <div className=" flex justify-center w-24 cursor-pointer border-b-4 pb-2 pt-1 border-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className=" w-8" viewBox="0 0 20 20" fill="#0466c8">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>

      </div>

      {/* right side */}
      <div className="right flex items-center">
        <span className="profile flex items-center">
          <img src={process.env.PUBLIC_URL + './facebook_icon.png'} alt="photo profile" className=' w-8 cursor-pointer' />
          <p className=' ml-1 font-semibold cursor-pointer'>Baiquni</p>
        </span>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mx-5 p-1 rounded-full cursor-pointer hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-2 rounded-full cursor-pointer hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-2 rounded-full cursor-pointer hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-2 rounded-full cursor-pointer hover:bg-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </nav>
  )
}

