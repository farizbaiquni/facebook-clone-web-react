import { collection, DocumentData, getDocs, getFirestore, limit, orderBy, query, QueryDocumentSnapshot, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { postType, reactTypeOption } from '../../constants/EntityType';
import PostCard from './PostCard';
import { db } from '../../lib/firebase';
import { useReactsListener } from '../../hooks/use-reacts-listener';


type reactPostsType = {
  like: Set<string>,
  love: Set<string>,
  care: Set<string>,
  haha: Set<string>,
  wow: Set<string>,
  sad: Set<string>,
  angry: Set<string>,
}

export default function Post() {

  console.log("====== RE-RENDER POST ======")

  const auth = useContext(AuthContext)
  const [statusListeningPosts, setStatusListeningPosts] = useState<Boolean | null | undefined>(null)
  const [posts, setPosts] = useState<Array<postType>>([])
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null | undefined>(null)
  const [isFirstQueryPostDone, setIsFirstQueryPostDone] = useState<boolean>(false)
  const [reactPosts, setReactPosts] = useState<reactPostsType | null>(null)
  const docRef = doc(db, "userReactPosts", auth!!.uid!!);


  const checkReactPostStatus = useCallback((idPost: string) => {
    // console.log("CALCULATING.......")
    if(reactPosts !== null || reactPosts !== undefined){
      for(const reactType in reactPosts){
        switch(reactType){
          case reactTypeOption.like:
            if(reactPosts[reactType as keyof reactPostsType].has(idPost)){
              return reactTypeOption.like
            } else {
              return null
            }
          default:
            return null
        }
      }
    } 
    return null
  }, [reactPosts]
)


  // FIRST QUERY POSTS
  const firstQueryPosts = async() => {
    try {
        console.log("CALLED QUERY FIRST POSTS")
        let idPostsArr: Array<string> = []
        const first = query(collection(db, "searchPosts"), where('accessAllowed', 'array-contains-any', ['XWbtx7l5njceLoy5XHrS7ESwTRU2']), orderBy('createdAt', 'desc'), limit(5));
        const documentSnapshots = await getDocs(first);
        documentSnapshots.forEach( post => {
          idPostsArr.push(post.id)
        })
        getDataPosts(idPostsArr)
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1])
    } catch (error) {
        console.log(error)
    }
  }



  //GET POSTS DATA
  const getDataPosts = async(idPostsArr: Array<string>) => {
    console.log("CALLED QUERY POSTS")
    try {
      const queryPosts = query(collection(db, "posts"), where('idPost', 'in', idPostsArr), orderBy("createdAt", "desc"));
      const documentSnapshots = await getDocs(queryPosts);
      const tempPosts = new Set(posts)
      documentSnapshots.forEach( post => {
        let tempPost = {
          "idPost"              :  post.data().idPost,
          "idUser"              :  post.data().idUser,
          "textPost"            :  post.data().textPost,
          "feeling"             :  post.data().feeling,
          "location"            :  post.data().location,
          "tagTotal"            :  post.data().tagTotal ? Number( post.data().tagTotal.toString() ) : 0,
          "shareTotal"          :  post.data().shareTotal ? Number( post.data().shareTotal.toString() ) : 0,
          "commentTotal"        :  post.data().commentTotal ? Number( post.data().commentTotal.toString() ) : 0,
          "createdAt"           :  post.data().createdAt ? post.data().createdAt.toDate() : null,
          "contentType"         :  post.data().contentType,
          "contentAttachment"   :  post.data().contentAttachment,
          "accessType"          :  post.data().accessType,
          "reactTotalLike"      :  post.data().reactTotalLike ? Number( post.data().reactTotalLike.toString() ) : 0,
          "reactTotalLove"      :  post.data().reactTotalLove ? Number( post.data().reactTotalLove.toString() ) : 0,
          "reactTotalCare"      :  post.data().reactTotalCare ? Number( post.data().reactTotalCare.toString() ) : 0,
          "reactTotalHaha"      :  post.data().reactTotalHaha ? Number( post.data().reactTotalHaha.toString() ) : 0,
          "reactTotalWow"       :  post.data().reactTotalWow ? Number( post.data().reactTotalWow.toString() ) : 0,
          "reactTotalSad"       :  post.data().reactTotalSad ? Number( post.data().reactTotalSad.toString() ) : 0,
          'reactTotalAngry'     :  post.data().reactTotalAngry ? Number( post.data().reactTotalAngry.toString() ) : 0,
        }
        tempPosts.add(tempPost)
      })
      setPosts(Array.from(tempPosts))
      setIsFirstQueryPostDone(true);
    } catch (error) {
      console.log(error)
    }
  }



  useEffect ( () => {
    const listenerReactPosts = onSnapshot(docRef, (doc) => {
      if(doc.exists()){
          try {
            console.log("CALLLED QUERY REACT");
            let tempReactPosts: reactPostsType = {
              like: (doc.data().like === undefined || doc.data().like === null) ? new Set() : new Set(doc.data().like),
              love: (doc.data().love === undefined || doc.data().love === null) ? new Set() : new Set(doc.data().love),
              care: (doc.data().care === undefined || doc.data().care === null) ? new Set() : new Set(doc.data().care),
              haha: (doc.data().haha === undefined || doc.data().haha === null) ? new Set() : new Set(doc.data().haha),
              wow: (doc.data().wow === undefined || doc.data().wow === null) ? new Set() : new Set(doc.data().wow),
              sad: (doc.data().sad === undefined || doc.data().sad === null) ? new Set() : new Set(doc.data().sad),
              angry: (doc.data().angry === undefined || doc.data().angry === null) ? new Set() : new Set(doc.data().angry),
            } 
            !isFirstQueryPostDone && setStatusListeningPosts(true); 
            setReactPosts(tempReactPosts)
            if(isFirstQueryPostDone === false){
              firstQueryPosts();
            } 
          } catch (error) {
              console.log("Error occured = " + error)
              setStatusListeningPosts(null)
          }      
      } else {
          console.log("Data Not Exist")
          setStatusListeningPosts(undefined);
          if(isFirstQueryPostDone === false){
            firstQueryPosts();
          }
      }
    })

    return () => listenerReactPosts()

  }, [auth, isFirstQueryPostDone])

  
  return (
    <div>
      {
        // Check make sure data from reactPosts fetched / no error
        (statusListeningPosts !== null) && (
          (statusListeningPosts === undefined) ? (
            posts.map(post => {
              const reactStatus = checkReactPostStatus(post.idPost);
              return <PostCard key={post.idPost} post={post} userId={auth!!.uid!!} reactStatus={reactStatus} statusListeningPosts={statusListeningPosts}/>
            } 
            )
          ) : (
            posts.map(post => {
              const reactStatus = checkReactPostStatus(post.idPost);
              return <PostCard key={post.idPost} post={post} userId={auth!!.uid!!} reactStatus={reactStatus} statusListeningPosts={statusListeningPosts}/>
            })
          )
        )
      }
    </div>
  )
  
}