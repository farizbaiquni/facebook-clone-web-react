import React from 'react'

export default function AddFriendCard() {
  return (
    <React.Fragment>
        <div className=' flex flex-col rounded-lg w-40 h-280px border border-gray-400 relative'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 p-1 cursor-pointer hover:bg-gray-700 bg-gray-600 opacity-75 rounded-full absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' object-cover h-160px rounded-t-lg'/>
            <span className=' px-3'>
                <p className=' mt-1 text-lg font-medium break-all line-clamp-1 text-left cursor-pointer'>Hanzzuhiga</p>
                <span className="flex items-center mt-1 cursor-pointer">
                    <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' w-5 h-5 rounded-full' />
                    <p className=' text-gray-500 ml-1 text-sm line-clamp-1'>100 mutual friends</p>
                </span>
            </span>

            <span className=' flex items-center rounded-lg my-auto hover:bg-blue-100 px-5 cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#4361ee">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <p className=' font-medium ml-1 text-blue-600'>Add Friend</p>
            </span>
        </div>
    </React.Fragment>
  )
}