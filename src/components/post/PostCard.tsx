import { arrayRemove, arrayUnion, doc, getFirestore, runTransaction, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import React, { memo, useEffect, useState } from 'react'
import { postType, reactTypeOption } from '../../constants/EntityType'
import { postType as postAccessType } from '../../constants/ModalPostInput'
import { headerPostType } from '../../constants/PostComponentType'
import ButtonAction from './ButtonAction'
import Comment from './Comment'
import ContentPost from './ContentPost'
import HeaderPost from './HeaderPost'
import InputComment from './InputComment'
import LikePost from './LikePost'
import TextStatusPost from './TextStatusPost'

type propsType = {
  post: postType,
  userId: string,
  reactStatus: null | string,
  statusListeningPosts: Boolean | undefined,
}

function PostCard(props: propsType) {

  const db = getFirestore()

  let headerPost: headerPostType = {
    username: props.post.username,
    createdAt: props.post.createdAt ? props.post.createdAt : null,
    accessType: props.post.accessType,
  }

  let totalReact = props.post.reactTotalAngry + props.post.reactTotalCare + props.post.reactTotalHaha +
  props.post.reactTotalLike + props.post.reactTotalLove + props.post.reactTotalSad + props.post.reactTotalWow


  console.log("====== POST CARD RE-RENDER " + props.post.textPost + " ======")
  // console.log("React status " + props.reactStatus)

  const handleRemoveLike = async () => {
    console.log("HANDLE REMOVE LIKE")
    if(props.statusListeningPosts !== undefined && props.reactStatus === reactTypeOption.like){
      const reactRef = doc(db, "userReactPosts", props.userId);
      // Atomically add a new region to the "regions" array field.
      await updateDoc(reactRef, {
          like: arrayRemove(props.post.idPost)
      });
    } 
  }

  const handleAddLike = async () => {
    console.log("HANDLE ADD LIKE")
    if(props.statusListeningPosts === undefined){
      await setDoc(doc(db, "userReactPosts", props.userId), {
        like: [props.post.idPost],
        love: [],
        care: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      });
    } else {
      const reactRef = doc(db, "userReactPosts", props.userId);
      // Atomically add a new region to the "regions" array field.
      await updateDoc(reactRef, {
          like: arrayUnion(props.post.idPost)
      });
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
        ( totalReact > 0 ) ? (
          <LikePost />
        ) : <br />
      }

      <ButtonAction userId={props.userId} handleAddLike={handleAddLike} reactStatus={props.reactStatus} handleRemoveLike={handleRemoveLike}/>
      
      <Comment />
      <InputComment />
    </div>
  )
}

export default memo(PostCard)