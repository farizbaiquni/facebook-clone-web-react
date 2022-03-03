import React, { useContext, useEffect, useState } from 'react'
import AddFriendCard from './AddFriendCard'
import { query, collection, where, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext';


type suggestedUserType =  {
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


export default function SuggestedFriends() {
  
    const[suggestedFriends, setSuggestedFriends] = useState<Array<Object>>([])
    const db = getFirestore()
    const authUser = useContext(AuthContext)

    const getSuggestedFriends = async() => {
        const suggested : Array<Object> = []
        // Fetch id user from request friends list 
        const idRequestFriends = query(collection(db, "requestFriends"), where("capital", "==", true));


        // Fetch id from friends list

        // Fetch suggested friends
        const q = query(collection(db, "users"), where("userId", "!=", authUser?.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            suggested.push(doc.data())
            // doc.data() is never undefined for query doc snapshots
            // setSuggestedFriends(prevState => [...prevState, doc.data()])
            // console.log(doc.id, " => ", doc.data());
        });
        setSuggestedFriends(suggested)
    }

    useEffect( () => {
        getSuggestedFriends()
    }, [])

    return (
        <div className=' overflow-x-auto overflow-y-hidden grid gap-1 grid-flow-col'>
            {
                suggestedFriends.map((value : suggestedUserType, index) => (
                    value.userId && <AddFriendCard key={value.userId} suggested={value} />
                ))
            }
        </div>
    )
}
