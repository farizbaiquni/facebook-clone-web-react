import { useEffect, useState } from 'react'
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

export const useReactsListener = (idUser: string) => {

    // ada data, 
    // tidak ada data, 
    // error atau fetch tidak sempurna atau belum melakukan fetch -> null

    const db = getFirestore()
    const [reactPosts, setReactPosts] = useState<Array<Array<string>> | null | undefined>(null)

    useEffect( () => {
        const unsubscribe = onSnapshot(
            doc(db, "userReactPosts", idUser), 
            (snapshot) => {
                if(snapshot.exists()){
                    let tempReactPosts: Array<Array<string>> = []
                    try {
                        (snapshot.data().like === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().like);
                        (snapshot.data().love === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().love);
                        (snapshot.data().care === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().care);
                        (snapshot.data().haha === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().haha);
                        (snapshot.data().wow === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().wow);
                        (snapshot.data().sad === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().sad);
                        (snapshot.data().angry === undefined) ? tempReactPosts.push([]) : tempReactPosts.push(snapshot.data().angry);
                    } catch (error) {
                        console.log("error 1 query react posts = " + error)
                        setReactPosts(null)
                     }
                    setReactPosts(tempReactPosts)
                } else {
                    console.log("Not Exist")
                    setReactPosts(undefined)
                }
            },
            (error) => {
                console.log("error 2 query react posts = " + error)
                setReactPosts(null)
        });
        return () => unsubscribe()
        
    }, [])

    return reactPosts
}