import React, { useContext, useEffect, useState } from 'react'
import AddFriendCard from './AddFriendCard'
import { query, collection, where, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
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
        
        let notSuggested: Array<String> = [authUser?.uid!]
        let suggested : Array<Object> = []

        //Fetch not suggested friends
        const docSnap = authUser?.uid ? await getDoc(doc(db, "notSuggestedFriends", authUser?.uid)) : undefined;
        if (docSnap?.exists()) {
            const [result] = docSnap.data().idList
            notSuggested.push(result)
            console.log(notSuggested)
        }

        // Fetch suggested friends
        const q = query(collection(db, "users"), where("userId", "not-in", notSuggested));
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
        authUser?.uid && getSuggestedFriends()
    }, [])

    return (
        <div className=' overflow-x-auto overflow-y-hidden grid gap-1 grid-flow-col'>
            {
                suggestedFriends.map((value : suggestedUserType, index) => (
                    (authUser?.uid && value.userId) && <AddFriendCard key={value.userId} suggested={value} />
                ))
            }
        </div>
    )
}
