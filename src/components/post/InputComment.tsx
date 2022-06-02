import { doc, runTransaction, Timestamp, writeBatch } from 'firebase/firestore';
import React, { useState } from 'react'
import { commentType, commentTypeOption } from '../../constants/EntityType';
import { db } from '../../lib/firebase';


type propsType = {
  userId: string,
  idPost: string,
}

export default function InputComment(props: propsType) {
  const [inputComment, setInputComment] = useState<string>('')
  const [commentType, setCommentType] = useState(commentTypeOption.text)
  const [contentAttachment, setContentAttachment] = useState(commentTypeOption.text)
  
  const addComment = async () => {
    const postRef = doc(db, 'posts', props.idPost);
    const commentRef = doc(db, 'comments'); 
    const createdAt = Timestamp.now()
    try {
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(postRef);
        
        if (!doc.exists()) {
          throw "Document does not exist!";
        }

        const newCommentTotal = (doc.data().commentTotal) ? 0 : (doc.data().commentTotal + 1);
        transaction.update(postRef, {
          commentTotal: newCommentTotal,
        })

        transaction.set(commentRef, {
          idUser: props.userId,
          text: inputComment,
          contentAttachment: contentAttachment,
          commentType: commentType,
          createdAt: createdAt,
          commentTotalReplay: 0,
          commentTotalLike: 0,
          commentTotalLove: 0,
          commentTotalCare: 0,
          commentTotalHaha: 0,
          commentTotalWow: 0,
          commentTotalSad: 0,
          commentTotalAngry: 0,
        })
        
      });
    } catch (e) {
      alert("Failed post comment")
    }

  }

  return (
    <div className=' flex mt-3 py-2' onClick={() => addComment()}>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
        <input type="text" placeholder='Write a comment...' className=' flex-1 px-2 focus:outline-none bg-gray-100 rounded-xl' />
    </div>
  )
}