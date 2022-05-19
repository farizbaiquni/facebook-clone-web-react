import React, { useContext, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'

export default function LeftSidebar() {

    let user = useContext(UserContext)
    const[seeMore, setSeeMore] = useState(false)

    const handleSeeMore = () => {
        setSeeMore(!seeMore)
    }
 
    return (
    <aside className="leftSide w-330px pl-3">
        <table className='w-full'>
            <tbody >
                <tr className=' hover:bg-gray-200 cursor-pointer'>
                    <td className=' py-2 pl-2'>
                        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="icon friends" className=' h-9 w-9 rounded-full'/>
                    </td>
                    <td className=' py-2 align-middle text-left font-medium cursor-pointer h-9 line-clamp-1'>{user?.firstName + " " + user?.lastName}</td>
                </tr>

                <tr className=' hover:bg-gray-200 cursor-pointer'>
                    <td className=' py-2 pl-2 pr-2'>
                        <img src={process.env.PUBLIC_URL + 'sidebarIcons/friends.png'} alt="icon friends" className=' h-9 w-9'/>
                    </td>
                    <td className=' py-2 align-middle text-left font-medium cursor-pointer'>Friends</td>
                </tr>

                <tr className=' hover:bg-gray-200 cursor-pointer'>
                    <td className=' py-2 pl-2'>
                        <img src={process.env.PUBLIC_URL + 'sidebarIcons/groups.png'} alt="icon groups" className=' h-9 w-9'/>
                    </td>
                    <td className=' py-2 text-left font-medium cursor-pointer'>Groups</td>
                </tr>

                <tr className=' hover:bg-gray-200 cursor-pointer'>
                    <td className=' py-2 pl-2'>
                        <img src={process.env.PUBLIC_URL + 'sidebarIcons/marketplace.png'} alt="icon marketplace" className=' h-9 w-9'/>
                    </td>
                    <td className=' py-2 text-left font-medium cursor-pointer'>Marketplace</td>
                </tr>

                <tr className=' hover:bg-gray-200 cursor-pointer'>
                    <td className=' py-2 pl-2'>
                        <img src={process.env.PUBLIC_URL + 'sidebarIcons/watch.png'} alt="icon watch" className=' h-9 w-9'/>
                    </td>
                    <td className=' py-2 text-left font-medium cursor-pointer'>Watch</td>
                </tr>

                <tr className={`${seeMore === false && 'hidden'} hover:bg-gray-200 cursor-pointer`}>
                    <td className=' py-2 pl-2'>
                        <img src={process.env.PUBLIC_URL + 'sidebarIcons/ads.png'} alt="icon ads" className=' h-9 w-9'/>
                    </td>
                    <td className=' py-2 text-left font-medium cursor-pointer'>Ads</td>
                </tr>

                <tr className={` ${seeMore === false && 'hidden'} hover:bg-gray-200 cursor-pointer`}>
                    <td className=' py-2 pl-2'>
                        <img src={process.env.PUBLIC_URL + 'sidebarIcons/climate.png'} alt="icon climate" className=' h-9 w-9'/>
                    </td>
                    <td className=' py-2 text-left font-medium cursor-pointer'>Climate science center</td>
                </tr>

                <tr onClick={() => handleSeeMore()} className=' group hover:bg-gray-200 cursor-pointer'>
                    <td className=' py-2 pl-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" className=" h-7 w-7 px-1 rounded-full cursor-pointer group-hover:bg-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {
                                seeMore ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> 
                            }
                        </svg>
                    </td>
                    {
                        seeMore === false ? 
                        <td className=' py-2 text-left font-medium cursor-pointer' >See more</td> :
                        <td className=' py-2 text-left font-medium cursor-pointer' >See less</td>
                    }
                    
                </tr>
            </tbody>
        </table>
    </aside>
    )
}