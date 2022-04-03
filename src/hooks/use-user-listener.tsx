import { useContext, useEffect, useState } from 'react'
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import firebase from "../lib/firebase"
import type { userType } from "../constants/EntityType"
import { AuthContext } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';

function useUserListener() {

    const db = getFirestore(firebase)
    const[user, setUser] = useState<userType | null>(null)
    let idUser: string = " "
    if(getAuth().currentUser?.uid !== undefined){
        idUser = getAuth().currentUser?.uid!!
    }

    useEffect( () => {

        const userListener = onSnapshot(doc(db, "users", idUser), (doc) => {
            if(doc.data() !== undefined){
                setUser({
                    firstName: doc.data()?.firstName,
                    lastName: doc.data()?.lastName,
                    email: doc.data()?.email,
                    birthDate: doc.data()?.birthDate,
                    photoProfile: doc.data()?.photoProfile,
                    gender: doc.data()?.gender,
                    createAt: doc.data()?.createAt,
                    friends: doc.data()?.friends,
                })
            }
        });

        return () => userListener()
        
    }, [idUser] )

    return user
}

export default useUserListener