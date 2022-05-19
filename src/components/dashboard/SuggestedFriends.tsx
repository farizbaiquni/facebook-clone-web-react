import React, { useContext, useEffect, useState } from 'react'
import AddFriendCard from './AddFriendCard'
import { query, collection, getDocs, getFirestore, doc, getDoc, limit, orderBy, startAfter } from "firebase/firestore";
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';


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
    
    const db = getFirestore()
    const authUser = useContext(AuthContext)
    const user = useContext(UserContext)

    const[suggestedFriends, setSuggestedFriends] = useState<Array<Object>>([])
    
    const getSuggestedFriends = async() => {
        
        let notSuggested: Set<String> = new Set()
        let suggested : Array<Object> = []
        let isFirstFetch = true
        let lastVisible = null
        let queryFetch = null
        let querySnapshots = null

        // ===== Fetch notSuggested friends =====
        const notSuggestedFriendsRef = doc(db, "notSuggestedFriends", authUser?.uid!);
        const notSuggestedFriendsSnap = await getDoc(notSuggestedFriendsRef);
        if (notSuggestedFriendsSnap.exists()) {
            const [idList] = notSuggestedFriendsSnap.data().idList 
            notSuggested.add(idList)
        }
        
        // ===== Fetch suggested friends =====
        // First fetch
        try {
            
            queryFetch = query(collection(db, "users"), orderBy("createAt"), limit(10))
            querySnapshots = await getDocs(queryFetch)
            querySnapshots.forEach((doc) => {
                (!notSuggested.has(doc.id)) && suggested.push(doc.data());
            });

            //Ensure that collection have minimum users
            if(querySnapshots.docs.length >= 10){
                while(suggested.length < 10){

                    // Determine last visible
                    if(isFirstFetch === true) {
                        lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1]    
                        isFirstFetch = false
                    } else {
                        lastVisible = querySnapshots.docs[querySnapshots.docs.length - 1]
                    }

                    queryFetch = query(collection(db, "users"), orderBy("createAt"), startAfter(lastVisible), limit(5))
                    querySnapshots = await getDocs(queryFetch)
                    querySnapshots.forEach((doc) => {
                        if(suggested.length < 10){
                            (!notSuggested.has(doc.id)) && suggested.push(doc.data())
                        } 
                    });

                    // Check if suggested users in collection still available
                    if(querySnapshots.docs.length < 5){
                        break
                    }

                }
            }
            setSuggestedFriends(suggested)
        } catch (error) { }

    }

    useEffect( () => {
        getSuggestedFriends() 
    }, [])


    return (
        <div className=' overflow-x-auto overflow-y-hidden grid gap-1 grid-flow-col w-600'>
            {
                suggestedFriends.map((value : suggestedUserType, index) => (
                    (authUser?.uid && value.userId) && <AddFriendCard key={value.userId} suggested={value} />
                ))
            }
        </div>
    )
}
