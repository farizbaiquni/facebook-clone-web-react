import { arrayRemove, arrayUnion, doc, getFirestore, runTransaction } from 'firebase/firestore'
import React, { memo, useContext, useEffect, useState } from 'react'
import { postType, reactTypeOption } from '../../constants/EntityType'
import { postType as postAccessType } from '../../constants/ModalPostInput'
import { headerPostType } from '../../constants/PostComponentType'
import { UserContext } from '../../contexts/UserContext'
import { db } from '../../lib/firebase'
import ButtonAction from './ButtonAction'
import Comment from './Comment'
import ContentPost from './ContentPost'
import HeaderPost from './HeaderPost'
import InputComment from './InputComment'
import ReactPost from './ReactPost'
import TextStatusPost from './TextStatusPost'

type propsType = {
  post: postType,
  userId: string,
  reactStatus: null | string,
  statusListeningPosts: Boolean | undefined,
}


function PostCard(props: propsType) {
  const user = useContext(UserContext)
  const reactDocRef = doc(db, "userReactPosts", props.userId)
  const postDocRef = doc(db, "posts", props.post.idPost)
  const [loadingProcessReact, setLoadingProcessReact] = useState<boolean>(false)

  let headerPost: headerPostType = {
    username: `${user?.firstName} ${user?.lastName}`,
    createdAt: props.post.createdAt ? props.post.createdAt : null,
    accessType: props.post.accessType,
  }

  let totalReact = props.post.reactTotalAngry + props.post.reactTotalCare + props.post.reactTotalHaha +
  props.post.reactTotalLike + props.post.reactTotalLove + props.post.reactTotalSad + props.post.reactTotalWow


  console.log("====== POST CARD RE-RENDER " + props.post.textPost + " ======")

  const handleRemoveLike = async () => {
    console.log("HANDLE REMOVE LIKE")
    if(props.statusListeningPosts !== undefined && props.reactStatus === reactTypeOption.like){
      // const reactRef = doc(db, "userReactPosts", props.userId);
      // await updateDoc(reactRef, {
      //     like: arrayRemove(props.post.idPost)
      // });  
      try {
        setLoadingProcessReact(true)
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(postDocRef);
          if (sfDoc.exists()) {
            const tempTotalLike = sfDoc.data().reactTotalLike - 1
            transaction.update(postDocRef, {
              reactTotalLike: tempTotalLike,
            })
            transaction.update(reactDocRef, {
              like: arrayRemove(props.post.idPost)
            })
          } 
        });
        setLoadingProcessReact(false)
      } catch (error) { setLoadingProcessReact(false) }
      
    } 
  }

  const handleAddLike = async () => {
    console.log("HANDLE ADD LIKE")
    if (props.statusListeningPosts !== null){
      if(props.statusListeningPosts === undefined){
        // await setDoc(doc(db, "userReactPosts", props.userId), {
        //   like: [props.post.idPost],
        //   love: [],
        //   care: [],
        //   haha: [],
        //   wow: [],
        //   sad: [],
        //   angry: [],
        // });
        
        // ================= COLLECTION USER REACT NOT CREATE YET =================
        try {
          setLoadingProcessReact(true)
          await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(postDocRef);
            if (sfDoc.exists()) {
              const tempTotalLike = sfDoc.data().reactTotalLike + 1
              if (tempTotalLike < 20){
                transaction.set(reactDocRef, {
                  like: [props.post.idPost],
                  love: [],
                  care: [],
                  haha: [],
                  wow: [],
                  sad: [],
                  angry: [],
                })
                transaction.update(postDocRef, {
                  reactTotalLike: tempTotalLike,
                })
              } else {
                transaction.set(reactDocRef, {
                  like: [props.post.idPost],
                  love: [],
                  care: [],
                  haha: [],
                  wow: [],
                  sad: [],
                  angry: [],
                })
              }
            } 
            setLoadingProcessReact(false)
          });
        } catch (error) { setLoadingProcessReact(false) }

      } else {
        // ================= COLLECTION USER REACT HAVE BEEN CREATED =================
        // const reactRef = doc(db, "userReactPosts", props.userId);
        // await updateDoc(reactRef, {
        //     like: arrayUnion(props.post.idPost)
        // });

        try {
          setLoadingProcessReact(true)
          await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(postDocRef);
            if (sfDoc.exists()) {
              const tempTotalLike = sfDoc.data().reactTotalLike + 1
              if (tempTotalLike < 20){
                transaction.update(reactDocRef, {
                  like: arrayUnion(props.post.idPost)
                })
                transaction.update(postDocRef, {
                  reactTotalLike: tempTotalLike,
                })
              } else {
                transaction.update(reactDocRef, {
                  like: arrayUnion(props.post.idPost)
                })
              }
            } 
          });
          setLoadingProcessReact(false)
        } catch (error) { setLoadingProcessReact(false) }
      }
    } 
    
  }

  useEffect(() => {
  }, [])

  return (
    <div className="post mb-10 bg-white w-600 p-5 rounded-md shadow-slate-400 shadow-sm border-0 border-gray-400">
      <HeaderPost headerPost={headerPost}/>
      <TextStatusPost textStatusPost={props.post.textPost} />
      {
        ( props.post.contentType !== postAccessType.textOnly && 
          props.post.contentType !== null &&
          props.post.accessType !== undefined 
        ) && (
            <ContentPost />
          )
      }
      
      {
        ( totalReact > 0 || props.reactStatus !== null ) ? (
          <ReactPost 
            totalReact={totalReact} 
            reactStatus={props.reactStatus} 
            reactTotalLike={props.post.reactTotalLike} 
            reactTotalLove={props.post.reactTotalLove}
            reactTotalCare={props.post.reactTotalCare}
            reactTotalHaha={props.post.reactTotalHaha}
            reactTotalWow={props.post.reactTotalWow}
            reactTotalSad={props.post.reactTotalSad}
            reactTotalAngry={props.post.reactTotalAngry}
          />
        ) : <br />
      }

      <ButtonAction 
        userId={props.userId} 
        handleAddLike={handleAddLike} 
        reactStatus={props.reactStatus} 
        handleRemoveLike={handleRemoveLike} 
        loadingProcessReact={loadingProcessReact}
      />
      
      <Comment />
      <InputComment
        userId={props.userId}
        idPost={props.post.idPost}
      />
    </div>
  )
}

export default memo(PostCard)