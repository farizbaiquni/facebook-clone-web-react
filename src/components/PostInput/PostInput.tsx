import { async } from '@firebase/util';
import { collection, doc, DocumentData, getDoc, getDocs, getFirestore, limit, orderBy, query, QueryDocumentSnapshot, QuerySnapshot, startAfter, Timestamp, writeBatch } from 'firebase/firestore';
import React, { createRef, lazy, Suspense, useContext, useEffect, useState } from 'react'
import Modal from 'react-modal';
import { AuthContext } from '../../contexts/AuthContext';
import UserProfile from './UserProfile';


type userProfileType =  {
    idUser: string
    photoUrl: string
    name: string
}

export default function PostInput() {

    const customStyles = {
        overlay: {
            backgroundColor: 'rgb(255, 255, 255, 0.8)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
        },
    };

    const modalShowOption = {
        main: 'main',
        access: 'access',
        except: 'except',
    }

    const accessTypeOption = {
        public: 'Public',
        friends: 'Friends',
        except: 'Except',
        specific: 'Specific',
        onlyMe: 'Only me',
    }

    const db = getFirestore()
    const authUser = useContext(AuthContext)
  
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    const [modalShowSpecific, setModalShowSpecific] = useState(modalShowOption.main)
    const [friendsProfile, setFriendsProfile] = useState<Array<userProfileType>>([])
    const [lastVisibleFriends, setLastVisibleFriends] = useState< QueryDocumentSnapshot<DocumentData> | undefined | null>(null)

    const accessPublicRef = createRef<HTMLInputElement>()
    const accessFriendscRef = createRef<HTMLInputElement>()
    const accessOnlyMeRef = createRef<HTMLInputElement>()
    const modalScrollDivRef = createRef<HTMLDivElement>()

    const [textInput, setTextInput] = useState('')
    const [accessType, setAccessType] = useState(accessTypeOption.friends)
    const [accessException, setAccessException] = useState(new Set<string>())
    const [contentType, setContentType] = useState('text-only')
    const [content, setContent] = useState<Object | null>(null)
    const [feeling, setFeeling] = useState(null)
    const [location, setLocation] = useState(null)
    const [tag, setTag] = useState<Array<Object> | null>(null)


    const handlePost = async() => {

        const authUserRef = doc(db, "users", authUser?.uid!);
        const docUserSnap = await getDoc(authUserRef);
        
        if(docUserSnap.exists()){

            const filteredAllowed = removeSpecificArray(docUserSnap.data().friends, accessException)

            const batch = writeBatch(db) 

            // Add data to posts collection
            const postRef = doc(db, 'posts')
            batch.set(postRef, {
                idUser: authUser?.uid!,
                text: (textInput.length > 0) ? textInput : null,
                createAt: Timestamp.now(),
                accessType,
                feeling: feeling ? feeling : null,
                location: location ? location : null,
                tag: tag ? tag : null,
                share: {
                    total: 0,
                    reiceverList: []
                },
                like    : { total: 0, idUser: [] },
                love    : { total: 0, idUser: [] },
                care    : { total: 0, idUser: [] },
                haha    : { total: 0, idUser: [] },
                wow     : { total: 0, idUser: [] },
                sad     : { total: 0, idUser: [] },
                angry   : { total: 0, idUser: [] },
                displayed_comment : null
            })
        
            // Add data to search posts collection
            const searchPostsRef = doc(db, 'searchPosts', postRef.id)
            batch.set(searchPostsRef, {
                accessType,
                accessAllowed: filteredAllowed
            })

        }else{
            alert("Something went wrong")
        }        
    }

    
    function removeSpecificArray(array: Array<string>, toRemove: Set<String>){
        if(toRemove.size > 0){
            const different = array.filter( data => !toRemove.has(data))
            return different
        } else {
            return array
        }
    }


    const firstFetchFriends = async() => {
        console.log("FIRST FETCH FRIENDS")
        let friends: Array<userProfileType> = []

        // Query the first page of docs
        const first = query(collection(db, "userProfile"), orderBy("name"), limit(5));
        const documentSnapshots = await getDocs(first);

        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        if(documentSnapshots.docs.length > 0) {
            documentSnapshots.docs.forEach( item => {
                friends.push({ idUser: item.data().idUser, photoUrl: item.data().photoUrl, name: item.data().name })
            })
            setFriendsProfile(friends)
            setLastVisibleFriends(lastVisible)
        } else {
            setLastVisibleFriends(undefined)
        }
        friends = []
    }


    const nextFetchFriends = async() => {
        console.log("NEXT FETCH FRIEND")
        let friends: Array<userProfileType> = friendsProfile

        // Construct a new query starting at this document,
        // get the next 25 cities.
        const next = query(collection(db, "userProfile"),
            orderBy("name"),
            startAfter(lastVisibleFriends),
            limit(2));

        const documentSnapshots = await getDocs(next);

        // Get the last visible document
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        if(documentSnapshots.docs.length > 0) {
            documentSnapshots.docs.forEach( item => {
                friends.push( { idUser: item.data().idUser, photoUrl: item.data().photoUrl, name: item.data().name } )
            })
            setFriendsProfile(friends)
            setLastVisibleFriends(lastVisible)
        } else {
            setLastVisibleFriends(undefined)
        }
        friends = []
    }


    const scrollModal = () => {
        if( (modalScrollDivRef.current?.scrollHeight! - modalScrollDivRef.current?.scrollTop!) === modalScrollDivRef.current?.clientHeight ){
            (lastVisibleFriends !== undefined) && nextFetchFriends()
        }
    }


    useEffect(()=>{
        firstFetchFriends()
    }, [])


    return (
        <div className="post-input mt-10 mb-7 shadow shadow-gray-400">
            <div className="top flex items-center py-3 ml-3">
                <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="profile-post" className=' rounded-full h-10 w-10' />
                <p className=' ml-3 mr-3 cursor-pointer text-gray-600 text-lg w-full text-left' onClick={ openModal }>What's on your mind, fariz?</p>
            </div>
            <div className='bottom flex justify-center py-2'>
                <span className=" flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#f94144">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <p className='ml-1 font-semibold text-gray-600'>Live video</p>
                </span>
                <span className=" flex items-center ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#52b788">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1 font-semibold text-gray-600'>Photo/video</p>
                </span>
                <span className=" flex items-center ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#f8961e">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1 font-semibold text-gray-600'>Feeling/activity</p>
                </span>
            </div>


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Sign Up"
                ariaHideApp={false}
            >   

                <form action="form-sign-up" className={`${ (modalShowSpecific !== modalShowOption.main) && ' h-500px' }`}>

                    { (() => {

                        switch (modalShowSpecific) {

                            case modalShowOption.main:
                                return (
                                    <div className=' flex flex-col'>
                                        <div className='flex w-full mb-5 justify-between items-center'>
                                            <p></p>
                                            <p className=' font-bold text-xl'>Create Post</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-1 rounded-full cursor-pointer hover:bg-slate-300" viewBox="0 0 20 20" fill="gray" onClick={closeModal}>
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className='flex items-center'>
                                            <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="profile" className='h-10 w-10 rounded-full cursor-pointer'/>
                                            <span className='ml-3'>
                                                <p className=' font-semibold'>{authUser?.displayName}</p>
                                                <span className='flex items-center cursor-pointer' onClick={() => setModalShowSpecific(modalShowOption.access)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className=' font-semibold text-sm'>{accessType}</p>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                </span>
                                            </span>
                                        </div>
                                        
                                        <textarea name="status" id="" cols={1} rows={5} placeholder="what's on your mind, baiquni" className=' text-2xl p-2 mt-5 border-none outline-none shadow-none resize-none' onChange={(e) => setTextInput(e.target.value)}></textarea>

                                        <div className=' flex items-center border-2 border-gray-300 justify-between px-3 py-4 rounded-md'>
                                            <p className=' font-semibold'>Add to your post</p>
                                            <span className=' flex'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-1 cursor-pointer" viewBox="0 0 20 20" fill="#52b788">
                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-1 cursor-pointer" viewBox="0 0 20 20" fill="#023e8a">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-1 cursor-pointer" viewBox="0 0 20 20" fill="#ffb703">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-1 cursor-pointer" viewBox="0 0 20 20" fill="#e56b6f">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-1 cursor-pointer" viewBox="0 0 20 20" fill="#c9184a">
                                                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 p-1 cursor-pointer" viewBox="0 0 20 20" fill="gray  "> 
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </span>
                                        </div>

                                        <button type='button' disabled={ textInput.length < 0 && true} className={` mt-5 rounded-md py-2 font-semibold ${textInput.length <= 0 ? 'bg-transparent text-gray-500' : ' bg-blue-600 text-white'}`}>Post</button>
                                    </div>
                                )
                                
                            case modalShowOption.access:
                                return (
                                    <div className=' overflow-x-hidden overflow-y-auto'>
                                        {/* Top bar modal */}
                                        <div className=' flex items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={ () =>
                                                setModalShowSpecific(modalShowOption.main) }>
                                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                                            </svg>
                                            <p className=' flex-1 text-center text-lg font-bold'>Select audience</p>
                                        </div>

                                        <div className=" flex flex-col mt-5">
                                            <p className=' font-semibold text-base'>Who can see your post?</p>
                                            <p className=' font-thin text-slate-500'>Your post will show up in Feed, on your profile and in search results.</p>
                                        </div>

                                        {/* content modal */}
                                        <div className=' flex flex-col mr-3'>
                                            <div className=" flex items-center group py-3 cursor-pointer mt-3" onClick={() => { 
                                                accessPublicRef.current?.click(); 
                                                setAccessType(accessTypeOption.public); 
                                                setTimeout( function(){  
                                                    setModalShowSpecific(modalShowOption.main);
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
                                            <div className=" flex items-center group py-3 cursor-pointer" onClick={() => { 
                                                setAccessType(accessTypeOption.friends);
                                                accessFriendscRef.current?.click(); 
                                                setTimeout( function(){  
                                                    setModalShowSpecific(modalShowOption.main);
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
                                            <div className=" flex items-center group py-3 cursor-pointer" onClick={() => { setModalShowSpecific(modalShowOption.except) }}>
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
                                            <div className=" flex items-center group py-3 cursor-pointer">
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
                                            <div className=" flex items-center group py-3 cursor-pointer" onClick={ () => { 
                                                accessOnlyMeRef.current?.click();
                                                setAccessType(accessTypeOption.onlyMe); 
                                                setTimeout( function(){  
                                                    setModalShowSpecific(modalShowOption.main);
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
                                            <div className=" flex items-center group py-3 cursor-pointer">
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

                            case modalShowOption.except: 
                                return (
                                    <div className=' overflow-x-hidden overflow-y-auto h-500px' ref={modalScrollDivRef} onScroll={scrollModal}>
                                        {/* Top bar modal */}
                                        <div className=' flex items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={ () =>
                                                setModalShowSpecific(modalShowOption.access) }>
                                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                                            </svg>
                                            <p className=' flex-1 text-center text-lg font-bold'>Friends Except...</p>
                                        </div>

                                        <div className=' flex mt-10 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="gray">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                            <input type="text" placeholder='Search for a friend or list...' className=' flex-1 focus:outline-none'/>
                                        </div>

                                        <div className=' mt-5'>
                                            <p className=' font-semibold'>Friends</p>
                                        </div>
                                        {
                                            friendsProfile.map((friend: userProfileType) => {
                                                return (
                                                    <UserProfile key={friend.idUser} friend={friend} />
                                                );
                                            })
                                        }
                                        
                                    </div>
                                )

                            default:
                                return null
                            }

                    })()}
                    
                </form>

            </Modal>

        </div>
    )
}

