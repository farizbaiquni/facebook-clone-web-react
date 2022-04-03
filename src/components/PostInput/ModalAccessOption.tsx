import React, { createRef, RefObject, useEffect, useState } from 'react'
import {modalShowOption, accessTypeOption} from '../../constants/ModalPostInput'

type propsType = {
    setModalShowSpecific: (data: string) => void
    setAccessType: (data: string) => void
    accessType: string
    handleSetRef: (
        publicRef: RefObject<HTMLInputElement>, 
        friendsRef: RefObject<HTMLInputElement>, 
        onlyMeRef: RefObject<HTMLInputElement>,
    ) => void
}

function ModalAccessOption(props: propsType) {

    const [accessType, SetAccessType] = useState<string>(props.accessType)
    const accessPublicRef = createRef<HTMLInputElement>()
    const accessFriendscRef = createRef<HTMLInputElement>()
    const accessOnlyMeRef = createRef<HTMLInputElement>()

    useEffect( () => {
            props.handleSetRef(accessPublicRef, accessFriendscRef, accessOnlyMeRef)
    }, [])

    return (
        <div className=''>
            {/* Top bar modal */}
            <div className=' flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={ () =>
                    props.setModalShowSpecific(modalShowOption.main) }>
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                <p className=' flex-1 text-center text-lg font-bold'>Select audience</p>
            </div>

            <div className=" flex flex-col mt-5">
                <p className=' font-semibold text-base'>Who can see your post?</p>
                <p className=' font-thin text-slate-500'>Your post will show up in Feed, on your profile and in search results.</p>
            </div>

            {/* content modal */}
            <div className=' overflow-x-hidden overflow-y-auto h-19rem flex flex-col my-3'>
                <div className=" flex items-center group py-3 cursor-pointer mt-3 mr-2" onClick={() => { 
                    accessPublicRef.current?.click(); 
                    props.setAccessType(accessTypeOption.public); 
                    setTimeout( function(){  
                        props.setModalShowSpecific(modalShowOption.main);
                    }, 200)
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 p-3 rounded-full group-hover:bg-gray-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="flex flex-col flex-1">
                        <p className=' text-base font-semibold'>Public</p>
                        <p className=' text-slate-500'>Anyone on or off Facebook</p>
                    </span>
                    <input type="radio" className=' scale-150 mr-1' ref={accessPublicRef} name="accessRadio" defaultChecked={accessType === accessTypeOption.public ? true : false}/>
                </div>
                <div className=" flex items-center group py-3 cursor-pointer mr-2" onClick={() => { 
                    props.setAccessType(accessTypeOption.friends);
                    accessFriendscRef.current?.click(); 
                    setTimeout( function(){  
                        props.setModalShowSpecific(modalShowOption.main);
                    }, 200)
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 p-3 rounded-full group-hover:bg-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="flex flex-col flex-1">
                        <p className=' text-base font-semibold'>Friends</p>
                        <p className=' text-slate-500'>Your friends on facebook</p>
                    </span>
                    <input type="radio" className=' scale-150 mr-1' ref={accessFriendscRef} name="accessRadio" defaultChecked={accessType === accessTypeOption.friends ? true : false} />
                </div>
                <div className=" flex items-center group py-3 cursor-pointer mr-2" onClick={() => { props.setModalShowSpecific(modalShowOption.except) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 p-3 rounded-full group-hover:bg-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                    </svg>
                    <span className="flex flex-col flex-1">
                        <p className=' text-base font-semibold'>Friends except...</p>
                        <p className=' text-slate-500'>Don't show to some friends</p>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                <div className=" flex items-center group py-3 cursor-pointer mr-2" onClick={() => { props.setModalShowSpecific(modalShowOption.specific) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 p-3 rounded-full group-hover:bg-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="flex flex-col flex-1">
                        <p className=' text-base font-semibold'>Specific friends</p>
                        <p className=' text-slate-500'>Only show to some friends</p>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                <div className=" flex items-center group py-3 cursor-pointer mr-2" onClick={ () => { 
                    accessOnlyMeRef.current?.click();
                    props.setAccessType(accessTypeOption.onlyMe); 
                    setTimeout( function(){  
                        props.setModalShowSpecific(modalShowOption.main);
                    }, 200)}
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 p-3 rounded-full group-hover:bg-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="flex flex-col flex-1">
                        <p className=' text-base font-semibold'>Only me</p>
                    </span>
                    <input type="radio" className=' scale-150 mr-1' ref={accessOnlyMeRef} name="accessRadio" defaultChecked={accessType === accessTypeOption.onlyMe ? true : false}/>
                </div>
                <div className=" flex items-center group py-3 cursor-pointer mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 p-3 rounded-full group-hover:bg-gray-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="flex flex-col flex-1">
                        <p className=' text-base font-semibold'>Custom</p>
                        <p className=' text-slate-500'>Include and exclude friends and lists</p>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

        </div>
    )
}

export default ModalAccessOption