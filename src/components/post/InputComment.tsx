import { setDoc, doc, Timestamp, collection } from 'firebase/firestore';
import { KeyboardEventHandler, useState } from 'react';
import { commentAttachmentType, commentAttachmentTypeOption } from '../../constants/EntityType';
import { db } from '../../lib/firebase';

type propsType = {
  userId: string,
  idPost: string,
}

export default function InputComment(props: propsType) {

  const [text, setText] = useState<string>("")
  const [attachmentType, setAttachmentType] = useState<commentAttachmentType>("text-only")

  const handleAddComment = async(event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.code === 'Enter') {
      console.log("HANDLE ADD COMMENT")
      await setDoc(doc(collection(db, "comments")), {
        idUser : props.userId,
        idPost : props.idPost,
        text : text,
        attachments : [],
        attachmentType : attachmentType,
        createdAt : Timestamp.now(),
        reactTotalReplay : 0,
        reactTotalLike : 0,
        reactTotalLove : 0,
        reactTotalCare : 0,
        reactTotalHaha : 0,
        reactTotalWow : 0,
        reactTotalSad : 0,
        reactTotalAngry : 0,
      })
      setText('')
    }
  }

  return (
    <div className=' flex mt-3 py-2'>
        <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder='Write a comment...' className=' flex-1 px-2 focus:outline-none bg-gray-100 rounded-xl' onKeyDown={handleAddComment} />
    </div>
  )
}