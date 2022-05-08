import { collection, DocumentData, getDocs, getFirestore, limit, orderBy, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { postType } from '../../constants/EntityType';
import PostCard from './PostCard';
import { useReactsListener } from '../../hooks/use_reacts_listener';

export default function Post() {

  const db = getFirestore()
  const auth = useContext(AuthContext)
  const reactPosts: Array<Array<string>> | null | undefined = useReactsListener(auth!!.uid!!)
  const [posts, setPosts] = useState<Array<postType>>([])
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null | undefined>(null)
  const [isFirstQueryDone, setIsFirstQueryDone] = useState(false)


  const firstQueryPosts = async() => {
    try {
        let idPostsArr: Array<string> = []

        // Query the first page of docs
        const first = query(collection(db, "searchPosts"), where('accessAllowed', 'array-contains-any', ['XWbtx7l5njceLoy5XHrS7ESwTRU2']), orderBy('createdAt', 'desc'), limit(5));
        const documentSnapshots = await getDocs(first);
        documentSnapshots.forEach( post => {
          idPostsArr.push(post.id)
        })

        getDataPosts(idPostsArr)
        
        // Set the last visible document
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1])
    } catch (error) {
        console.log(error)
    }
  }


  const getDataPosts = async(idPostsArr: Array<string>) => {
    try {
      const queryPosts = query(collection(db, "posts"), where('idPost', 'in', idPostsArr), orderBy("createdAt", "desc"));
      const documentSnapshots = await getDocs(queryPosts);

      documentSnapshots.forEach( post => {
        console.log(post.data().createdAt)
        let tempDefaultDisplayedComment = {
          "commentId" : post.data().commentId,
          "commentIdUser" : post.data().commentIdUser,
          "commentText" : post.data().commentText,
          "commentContentAttachment" : post.data().commentContentAttachment,
          "commentCreatedAt" : post.data().commentCreatedAt ? post.data().commentCreatedAt as Date : null,
          "commentReplay" : post.data().commentReplay,
          "commentTotalLike" : post.data().commentTotalLike,
          "commentTotalLove" : post.data().commentTotalLove,
          "commentTotalCare" : post.data().commentTotalCare,
          "commentTotalHaha" : post.data().commentTotalHaha,
          "commentTotalWow" : post.data().commentTotalWow,
          'commentTotalSad' : post.data().commentTotalSad,
          "commentTotalAngry" : post.data().commentTotalAngry,
        }

        let tempPost = {
          "idPost"              :  post.data().idPost,
          "idUser"              :  post.data().idUser,
          "username"            :  post.data().username,
          "textPost"            :  post.data().textPost,
          "feeling"             :  post.data().feeling,
          "location"            :  post.data().location,
          "tagTotal"            :  post.data().tagTotal,
          "tagNames"            :  post.data().tagNames,
          "createdAt"           :  post.data().createdAt ? post.data().createdAt.toDate() : null,
          "contentType"         :  post.data().contentType,
          "contentAttachment"   :  post.data().contentAttachment,
          "accessType"          :  post.data().accessType,
          "shareTotal"          :  post.data().shareTotal,
          "shareNames"          :  post.data().shareNames,
          "reactTotalLike"      :  post.data().reactTotalLike ? Number( post.data().reactTotalLike.toString() ) : 0,
          "reactTotalLove"      :  post.data().reactTotalLove ? Number( post.data().reactTotalLove.toString() ) : 0,
          "reactTotalCare"      :  post.data().reactTotalCare ? Number( post.data().reactTotalCare.toString() ) : 0,
          "reactTotalHaha"      :  post.data().reactTotalHaha ? Number( post.data().reactTotalHaha.toString() ) : 0,
          "reactTotalWow"       :  post.data().reactTotalWow ? Number( post.data().reactTotalWow.toString() ) : 0,
          "reactTotalSad"       :  post.data().reactTotalSad ? Number( post.data().reactTotalSad.toString() ) : 0,
          'reactTotalAngry'     :  post.data().reactTotalAngry ? Number( post.data().reactTotalAngry.toString() ) : 0,
          "reactNamesLike"      :  post.data().reactNamesLike,
          "reactNamesLove"      :  post.data().reactNamesLove,
          'reactNamesCare'      :  post.data().reactNamesCare,
          'reactNamesHaha'      :  post.data().reactNamesHaha,
          "reactNamesWow"       :  post.data().reactNamesWow,
          'reactNamesSad'       :  post.data().reactNamesSad,
          "reactNamesAngry"     :  post.data().reactNamesAngry,
           tempDefaultDisplayedComment
        } 

        setPosts(prevPosts => [...prevPosts, tempPost])

      })
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect( () => {
    firstQueryPosts()
  }, [auth])

  
  return (
    <div>
      {
        (reactPosts !== null && auth !== null) && (
          (reactPosts === undefined) ? (
            posts.map(post => (
              <PostCard key={post.idPost} post={post} reactPosts={reactPosts} userId={auth!!.uid!!} />
            ))
          ) : (
            (reactPosts!!.length >= 7) ? (
              posts.map(post => (
                <PostCard key={post.idPost} post={post} reactPosts={reactPosts} userId={auth!!.uid!!} />
              ))
            ) : { }
          )
        )
      }
    </div>
  )
  
}