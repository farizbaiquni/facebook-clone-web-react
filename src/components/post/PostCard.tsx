import { doc, getFirestore, setDoc } from 'firebase/firestore'
import React, { memo, useEffect, useState } from 'react'
import { postType, reactType, reactTypeOption } from '../../constants/EntityType'
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
  reactPosts: Array<Array<string>> | undefined,
  userId: string,
}

function PostCard(props: propsType) {

  console.log("====== POST CARD RE-RENDER ======")

  let headerPost: headerPostType = {
    username: props.post.username,
    createdAt: props.post.createdAt ? props.post.createdAt : null,
    accessType: props.post.accessType,
  }

  let totalReact = props.post.reactTotalAngry + props.post.reactTotalCare + props.post.reactTotalHaha +
  props.post.reactTotalLike + props.post.reactTotalLove + props.post.reactTotalSad + props.post.reactTotalWow
  

  const db = getFirestore()
  const [reactLike, setReactLike] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[0]) : new Set([]))
  const [reactLove, setReactLove] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[1]) : new Set([]))
  const [reactCare, setReactCare] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[2]) : new Set([]))
  const [reactHaha, setReactHaha] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[3]) : new Set([]))
  const [reactWow, setReactWow] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[4]) : new Set([]))
  const [reactSad, setReactSad] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[5]) : new Set([]))
  const [reactAngry, setReactAngry] = useState<Set<string>>( props.reactPosts !== undefined ? new Set(props.reactPosts[6]) : new Set([]))
  const [reactStatus, setReactStatus] = useState<string | null>(null)
  
  const checkReactStatus = (idPost: string) => {
    if(reactLike.has(idPost)){
      setReactStatus(reactTypeOption.like)
    } else if(reactLove.has(idPost)){
      setReactStatus(reactTypeOption.love)
    } else {
      setReactStatus(null)
    }
  }
  
  const handleReactLike = async(idPost: string) => {
        reactLike.add(idPost)
        handleReact(reactTypeOption.like)
  }

  const handleReact = async( reactType: string ) => {
      if(props.reactPosts === undefined){
          await setDoc(doc(db, "userReactPosts", props.userId), {
              like: Array.from(reactLike),
              love: Array.from(reactLove),
              care: Array.from(reactCare),
              haha: Array.from(reactHaha),
              wow: Array.from(reactWow),
              sad: Array.from(reactSad),
              angry: Array.from(reactAngry),
            });
      }else{
          switch (reactType) {
            case reactTypeOption.like:
              await setDoc(doc(db, "userReactPosts", props.userId), {
                like: Array.from(reactLike),
              });
              break;
          
            default:
              break;
          }
      }
  }

  return (
    <div className="post ml-3 mb-10">
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

      {
        
      }
      <ButtonAction reactPosts={props.reactPosts} userId={props.userId} handleReactLike={() => handleReactLike}/>
      <Comment />
      <InputComment />
    </div>
  )
}

export default memo(PostCard)