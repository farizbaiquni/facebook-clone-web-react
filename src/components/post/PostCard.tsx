import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, runTransaction, Timestamp, where } from 'firebase/firestore'
import { memo, useContext, useEffect, useState, useCallback } from 'react'
import { idNewCommentsType, commentDisplayedType, postType, reactTypeOption } from '../../constants/EntityType'
import { postType as postAccessType } from '../../constants/ModalPostInput'
import { headerPostType } from '../../constants/PostComponentType'
import { UserContext } from '../../contexts/UserContext'
import { db } from '../../lib/firebase'
import ButtonAction from './ButtonAction'
import Comment from './Comment'
import ContentPost from './ContentPost'
import HeaderPost from './HeaderPost'
import InputComment from './InputComment'
import NewComment from './NewComment'
import ReactPost from './ReactPost'
import TextStatusPost from './TextStatusPost'

type propsType = {
  post: postType,
  userId: string,
  reactStatus: null | string,
  statusListeningPosts: Boolean | undefined,
}


function PostCard(props: propsType) {
  console.log("====== RE-RENDER CARD POST - " + props.post.textPost + " ======")

  const user = useContext(UserContext)
  const reactDocRef = doc(db, "userReactPosts", props.userId)
  const postDocRef = doc(db, "posts", props.post.idPost)
  const [loadingProcessReact, setLoadingProcessReact] = useState<boolean>(false)
  const [firstFetchCommentDone, setFirstFetchCommentDone] = useState(false)
  
  const [timeFirstRender, setTimeFirstRender] = useState(Timestamp.now())
  const [comments, setComments] = useState<commentDisplayedType[]>([])
  const [newComments, setNewComments] = useState<commentDisplayedType[]>([])
  const [idNewComments, setIdNewComments] = useState<idNewCommentsType[]>([])


  let headerPost: headerPostType = {
    username: `${user?.firstName} ${user?.lastName}`,
    createdAt: props.post.createdAt ? props.post.createdAt : null,
    accessType: props.post.accessType,
  }

  let totalReact = props.post.reactTotalAngry + props.post.reactTotalCare + props.post.reactTotalHaha +
  props.post.reactTotalLike + props.post.reactTotalLove + props.post.reactTotalSad + props.post.reactTotalWow


  const firstFetchComment = async() => {
    const q = query(
      collection(db, "comments"), 
        where("idPost", "==", props.post.idPost), 
        where("createdAt", "<", timeFirstRender), 
        orderBy('createdAt'), 
        limit(1)
      );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if(doc.id != null) {
          const tempComments: commentDisplayedType = {
            idComment : doc.id, 
            idUser : doc.data().idUser,
            idPost : doc.data().idPost,
            text : doc.data().text ?? '',
            attachments: doc.data().attachments,
            attachmentType : doc.data().attachmentType,
            createdAt : doc.data().createdAt,
            reactTotalReplay : doc.data().reactTotalReplay ?? 0,
            reactTotalLike : doc.data().reactTotalLike ?? 0,
            reactTotalLove : doc.data().reactTotalLove ?? 0,
            reactTotalCare : doc.data().reactTotalCare ?? 0,
            reactTotalHaha : doc.data().reactTotalHaha ?? 0,
            reactTotalWow : doc.data().reactTotalWow ?? 0,
            reactTotalSad : doc.data().reactTotalSad ?? 0,
            reactTotalAngry : doc.data().reactTotalAngry ?? 0,
            idCommentTemp: null,
          }
          setComments([tempComments])
          setFirstFetchCommentDone(true)
        }
    })
  }

  const addNewComment = useCallback((comment: commentDisplayedType) => {
    setNewComments(prevstate => [comment, ...prevstate])
  }, [newComments])


  const handleAddIdComments = useCallback((tempId: string, realId: string) => {
    const temp: idNewCommentsType = {
      tempId: tempId,
      realId: realId,
    }
    setIdNewComments(prev => [...prev, temp])
  }, [idNewComments])


  const deleteNewComment = useCallback( async(idComment: string, deletedId: string) => {
   try {
      console.log("=== DELETE COMMENT ===")
      await deleteDoc(doc(db, "comments", idComment)).then(() => {
        setNewComments(prevState => prevState.filter(comment => comment.idCommentTemp !== deletedId))
      });
   } catch (error) { }
  }, [newComments])

  const deleteComment = useCallback( async(deletedIdComment: string) => {
   try {
      console.log("=== DELETE COMMENT ===")
      await deleteDoc(doc(db, "comments", deletedIdComment)).then(() => {
        setComments(prevState => prevState.filter(comment => comment.idComment !== deletedIdComment))
      });
   } catch (error) { }
  }, [comments])

  const updateTextNewComment = useCallback( async(text: string, editedId: string) => {
    try {
      setNewComments( prevState => prevState.map(el => (el.idCommentTemp === editedId ? { ...el, text } : el)) )
    } catch (error) { }
   }, [newComments])


  const handleRemoveLike = useCallback( async() => {
    console.log("HANDLE REMOVE LIKE")
    if(props.statusListeningPosts !== undefined && props.reactStatus === reactTypeOption.like){
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
  }, [props.statusListeningPosts, props.reactStatus])


  const handleAddLike = useCallback(async () => {
    console.log("HANDLE ADD LIKE")
    if(props.statusListeningPosts == null){
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
  }, [props.statusListeningPosts])


  useEffect(() => {
    if(firstFetchCommentDone === false) {
      firstFetchComment()
    }

  }, [comments, idNewComments, newComments])

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

      <InputComment 
        userId={props.userId} 
        idPost={props.post.idPost} 
        addNewComment={addNewComment}
        handleAddIdComments={handleAddIdComments}
       />

      {
        newComments.length > 0 && newComments.map( comment => (
          <NewComment 
            key={comment.idCommentTemp}
            comment={comment} 
            username={user?.firstName + " " + user?.lastName}
            photoUrl={user?.photoProfile.toString()}
            idNewComments={idNewComments}
            deleteNewComment={deleteNewComment}
            updateTextNewComment={updateTextNewComment}
          />
        ))
      }
    
      {
        comments.length > 0 && comments.map( comment => (
          <Comment key={comment.idComment} comment={comment} deleteComment={deleteComment}/>
        ))
      }

    </div>
  )
}

export default memo(PostCard)