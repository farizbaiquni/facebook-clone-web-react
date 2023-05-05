import { setDoc, doc, Timestamp, collection, addDoc } from "firebase/firestore";
import { KeyboardEventHandler, useState } from "react";
import { commentAttachmentType, commentDisplayType, commentType } from "../../constants/EntityType";
import { db } from "../../lib/firebase";
import { v4 as uuidv4 } from "uuid";

type propsType = {
  userId: string;
  idPost: string;
  addNewComment: (id: string, comment: commentDisplayType) => void;
};

export default function InputComment(props: propsType) {
  const [text, setText] = useState<string>("");
  const [attachmentType, setAttachmentType] = useState<commentAttachmentType>("text-only");

  const createCommentObject = (): commentType => {
    const object: commentType = {
      idUser: props.userId,
      idPost: props.idPost,
      text: text,
      attachments: [],
      attachmentType: attachmentType,
      createdAt: Timestamp.now(),
      reactTotalReplay: 0,
      reactTotalLike: 0,
      reactTotalLove: 0,
      reactTotalCare: 0,
      reactTotalHaha: 0,
      reactTotalWow: 0,
      reactTotalSad: 0,
      reactTotalAngry: 0,
    };
    return object;
  };

  const createCommenDisplaytObject = (): commentDisplayType => {
    const uuid = uuidv4();
    const object: commentDisplayType = {
      id: uuid,
      idUser: props.userId,
      idPost: props.idPost,
      text: text,
      attachments: [],
      attachmentType: attachmentType,
      createdAt: Timestamp.now(),
      reactTotalReplay: 0,
      reactTotalLike: 0,
      reactTotalLove: 0,
      reactTotalCare: 0,
      reactTotalHaha: 0,
      reactTotalWow: 0,
      reactTotalSad: 0,
      reactTotalAngry: 0,
      pending: true,
    };
    return object;
  };

  const handleAddComment = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      console.log("HANDLE ADD COMMENT");
      const commentsRef = collection(db, "comments", props.idPost, "commentList");
      const newCommentDisplayObject = createCommenDisplaytObject();
      const newCommentObject = createCommentObject();
      props.addNewComment(newCommentDisplayObject.id, newCommentDisplayObject);
      await addDoc(commentsRef, newCommentObject)
        .then((doc) => {})
        .catch((e) => console.log("error"));
    }
  };

  return (
    <div className=" mt-3 flex py-2">
      <img
        src={process.env.PUBLIC_URL + "./profile.jpg"}
        alt=""
        className=" mr-2 h-8 w-8 rounded-full"
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className=" flex-1 rounded-xl bg-gray-100 px-3 focus:outline-none"
        onKeyDown={handleAddComment}
      />
    </div>
  );
}
