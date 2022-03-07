import React from 'react'

type PropsType = {
    isMorePofileVisible: boolean
}


export default function ProfilePopUpMenu(props: PropsType) {


    return (
        <React.Fragment>

            <div className={`origin-top-right absolute right-0 mt-4 w-96 rounded-md shadow-lg shadow-slate-500 bg-white ${props.isMorePofileVisible ? 'block' : 'hidden'} z-30`}>
                <div className="py-1 " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <span className="flex flex-col px-4 py-2 text-md text-left" role="menuitem">
                        
                        <div className=' flex items-center cursor-pointer my-2'>
                            <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' rounded-full w-14 h-14' />
                            <div className=" flex flex-col ml-3">
                                <p className=' font-semibold line-clamp-1'>Fariz Baiquni</p>
                                <p className=' text-sm text-slate-500'>See your profile</p>
                            </div>
                        </div>

                        <hr className=' bg-slate-300 h-3px mt-2'/>

                        <div className=' flex items-center mx-2 my-3 cursor-pointer group'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="flex flex-col ml-4">
                                <p className=' font-semibold'>Give Feedback</p>
                                <p className=' text-sm text-slate-500'>Help us improve Facebook</p>
                            </span>
                        </div>

                        <hr className=' bg-slate-300 h-1px' />

                        <div className=' mx-2'>
                            <div className=' flex justify-between mt-5 cursor-pointer'>
                                <span className=' flex group'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                <p className=' font-semibold ml-4'>Setting & Privacy</p>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className=' flex justify-between my-7 cursor-pointer'>
                                <span className=' flex group'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    <p className=' font-semibold ml-4'>Help & Support</p>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className=' flex justify-between my-7 cursor-pointer'>
                                <span className=' flex group'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    <p className=' font-semibold ml-4'>Display & Accessibility</p>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className=' flex justify-between mt-7 cursor-pointer group'>
                                <span className=' flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 rounded-full p-1 group-hover:bg-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    <p className=' font-semibold ml-4'>Log Out</p>
                                </span>
                            </div>

        
                            <div className='flex flex-col flex-wrap text-xs text-slate-500 mt-4'>
                                <span className="flex">
                                    <span className="flex">
                                        <p className=' cursor-pointer hover:underline'>Privacy</p>
                                        <p className=' mx-1'>.</p>
                                    </span>
                                    <span className="flex">
                                        <p className=' cursor-pointer hover:underline'>Terms</p>
                                        <p className=' mx-1'>.</p>
                                    </span>
                                    <span className="flex">
                                        <p className=' cursor-pointer hover:underline'>Advertising</p>
                                        <p className=' mx-1'>.</p>
                                    </span>
                                    <span className="flex">
                                        <p className=' cursor-pointer hover:underline'>Ad Choices</p>
                                        <p className=' mx-1'>.</p>
                                    </span>
                                    <span className="flex">
                                        <p className=' cursor-pointer'>Cookies</p>
                                    </span>
                                </span>
                                <span className=' flex'>
                                    <span className="flex">
                                        <p className=' cursor-pointer hover:underline'>More</p>
                                        <p className=' mx-1'>.</p>
                                    </span>
                                    <span className="flex">
                                        <p className=' cursor-pointer hover:underline'>Meta</p>
                                        <p className=' mx-1'>.</p>
                                    </span>
                                    <span className="flex">
                                        <p className=' cursor-pointer'>2022</p>
                                    </span>
                                </span>
                            </div>

                        </div>

                    </span>
                </div>
            </div>
        </React.Fragment>
    )
}