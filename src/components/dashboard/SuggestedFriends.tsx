import React, { useContext, useEffect, useState } from 'react'
import AddFriendCard from './AddFriendCard'
import { query, collection, getDocs, getFirestore, doc, getDoc, limit, orderBy, startAfter } from "firebase/firestore";
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
        let isFirstFetch = true
        let lastVisible = null
        let queryFetch = null
        let querySnapshots = null

        // ===== Fetch not suggested friends =====
        const docSnap = authUser?.uid ? await getDoc(doc(db, "notSuggestedFriends", authUser?.uid)) : undefined;
        if (docSnap?.exists()) {
            const [result] = docSnap.data().idList
            notSuggested.push(result)
        }


        // ===== Fetch suggested friends =====
        // First fetch
        try {
            queryFetch = query(collection(db, "users"), orderBy("createAt"), limit(10))
            querySnapshots = await getDocs(queryFetch)
            querySnapshots.forEach((doc) => {
                (!notSuggested.includes(doc.data().userId)) && suggested.push(doc.data())
                console.log(doc.data())
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
                            (!notSuggested.includes(doc.data().userId)) && suggested.push(doc.data())
                        } 
                    });

                    // Check if users in collection still available
                    if(querySnapshots.docs.length < 5){
                        break
                    }

                }
            }

            console.log(suggested)

            setSuggestedFriends(suggested)

        } catch (error) {
            
        }

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
