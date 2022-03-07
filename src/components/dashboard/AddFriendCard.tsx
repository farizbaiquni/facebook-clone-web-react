import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getFirestore, runTransaction, setDoc, updateDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

type propsType = {
    suggested: {
        birthDate?: String
        createAt?: {
            nanoseconds?: number
            seconds?: number
        }
        firstName?: String
        friends?: []
        gender?: String
        lastName?: String
        userId?: string
        photoUrl?: String
    }
}


export default function AddFriendCard(props: propsType) {

    const [isRequestSend, setIsRequestSend] = useState<boolean>(false)
    const [idRequest, setIdRequest] = useState<string | null>(null)
    const authUser = useContext(AuthContext)
    const db = getFirestore()

    const handleAddFriends = async () => {
        try {
            const ref = doc(collection(db, 'requestFriends'));

            await runTransaction(db, async (transaction) => {

                const notSuggestedAuth =  await transaction.get(doc(db, "notSuggestedFriends", authUser?.uid!));
                const notSuggestedTarget =  await transaction.get(doc(db, "notSuggestedFriends", props.suggested.userId!));

                // Add friend request 
                transaction.set(ref, {
                    sender: authUser?.uid!,
                    receiver: props.suggested.userId!
                });


                if (!notSuggestedAuth?.exists()) {
                    transaction.set(doc(db, "notSuggestedFriends", authUser?.uid!), {
                        idList: [props.suggested.userId]
                    });
                }else{
                    transaction.update(doc(db, "notSuggestedFriends", authUser?.uid!), {
                        idList: arrayUnion(props.suggested.userId)
                    }); 
                }

                
                if (!notSuggestedTarget?.exists()) {
                    transaction.set(doc(db, "notSuggestedFriends", props.suggested.userId!), {
                        idList: [authUser?.uid!]
                    });
                }else{
                    transaction.update(doc(db, "notSuggestedFriends", props.suggested.userId!), {
                        idList: arrayUnion(authUser?.uid!)
                    }); 
                }

                setIsRequestSend(true)
                setIdRequest(ref.id)

              });

        } catch (error) {
            alert(error)
        }
    }

    const handleCancelAddFriend = async() => {
        try {
            await runTransaction(db, async (transaction) => {
                transaction.delete(doc(db, 'requestFriends', idRequest!))
                    .update(doc(db, "notSuggestedFriends", authUser?.uid!), {
                        idList: arrayRemove(props.suggested.userId)
                    }).update(doc(db, "notSuggestedFriends", props.suggested.userId!), {
                        idList: arrayRemove(authUser?.uid)
                    });
                
                setIsRequestSend(false)
                setIdRequest(null)

            });
        } catch (error) {
            alert(error)
        }
    }

    
    return (
        <React.Fragment>
            <div className=' flex flex-col rounded-lg w-40 h-280px border border-gray-400 relative'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 p-1 cursor-pointer hover:bg-gray-700 bg-gray-600 opacity-75 rounded-full absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {
                    props.suggested.photoUrl ? <img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="" className=' object-cover h-160px p-7 rounded-t-lg'/> : <img src={process.env.PUBLIC_URL + './user.png'} alt="" className=' object-cover h-160px p-7 rounded-t-lg'/>
                }
                <span className=' pl-5 pr-3'>
                    <p className=' mt-1 text-lg font-medium break-all line-clamp-1 text-left cursor-pointer'> { props.suggested.firstName } { props.suggested.lastName  } </p>
                    {/* <span className="flex items-center mt-1 cursor-pointer">
                        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' w-5 h-5 rounded-full' />
                        <p className=' text-gray-500 text-left ml-1 text-xs line-clamp-1'>Request sent</p>
                    </span> */}
                    {
                        (idRequest != null) ? (
                            (isRequestSend) ? (
                                <span className="flex items-center cursor-pointer">
                                    <p className=' text-gray-500 text-left line-clamp-1'>Request sent</p>
                                </span>
                            ) : (
                                <span className="flex items-center cursor-pointer">
                                    <p className=' text-gray-500 text-left line-clamp-1'>Request canceled</p>
                                </span>
                            )
                        ) : (
                            <span className="flex items-center cursor-pointer">
                                <p className=' text-gray-500 text-left ml-1 line-clamp-1 invisible'>.</p>
                            </span>
                        )
                    }
                </span>

                
                {
                    !isRequestSend ? (
                        <span className=' flex items-center justify-center rounded-lg my-auto hover:bg-blue-100 mx-1 px-5 py-2 cursor-pointer' onClick={ () => (authUser?.uid && props.suggested.userId) && handleAddFriends() }>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#4361ee">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            <p className=' font-medium ml-1 text-blue-600'>Add Friend</p>
                        </span> ) : (
                        <span className=' flex items-center justify-center rounded-lg my-auto hover:bg-gray-300 mx-1 px-5 py-2 cursor-pointer' onClick={ () => (authUser?.uid && props.suggested.userId) && handleCancelAddFriend() }>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#black">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            <p className=' font-medium ml-1'>Cancel</p>
                        </span>)
                }
            </div>
        </React.Fragment>
    )
}