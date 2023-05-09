import { Timestamp, collection, addDoc } from "firebase/firestore";
import { commentAttachmentType, commentDisplayType, commentType } from "../../constants/EntityType";
import { db } from "../../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { memo, useState } from "react";

type propsType = {
  userId: string;
  idPost: string;
  addNewComment: (id: string, comment: commentDisplayType) => void;
  changePendingStatus: (key: string, isPending: boolean) => void;
};

function InputComment(props: propsType) {
  const [text, setText] = useState<string>("");
  const [attachmentType] = useState<commentAttachmentType>("text-only");

  const createCommentObject = (): commentType => {
    const object: commentType = {
      idUser: props.userId,
      replyCommentId: null,
      text: text,
      attachments: [],
      attachmentType: attachmentType,
      createdAt: Timestamp.now(),
      reactTotalReply: 0,
      reactTotalLike: 0,
      reactTotalLove: 0,
      reactTotalCare: 0,
      reactTotalHaha: 0,
      reactTotalWow: 0,
      reactTotalSad: 0,
      reactTotalAngry: 0,
      totalReply: 0,
    };
    return object;
  };

  const createCommenDisplaytObject = (): commentDisplayType => {
    const uuid = uuidv4();
    const object: commentDisplayType = {
      id: uuid,
      idPost: props.idPost,
      replyCommentId: null,
      idUser: props.userId,
      text: text,
      attachments: [],
      attachmentType: attachmentType,
      createdAt: Timestamp.now(),
      reactTotalReply: 0,
      reactTotalLike: 0,
      reactTotalLove: 0,
      reactTotalCare: 0,
      reactTotalHaha: 0,
      reactTotalWow: 0,
      reactTotalSad: 0,
      reactTotalAngry: 0,
      totalReact: 0,
      isPending: true,
      totalReply: 0,
    };
    return object;
  };

  const handleAddComment = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      setText("");
      const commentsRef = collection(db, "comments", props.idPost, "comment");
      const newCommentDisplayObject = createCommenDisplaytObject();
      const newCommentObject = createCommentObject();
      props.addNewComment(newCommentDisplayObject.id, newCommentDisplayObject);
      await addDoc(commentsRef, newCommentObject)
        .then((doc) => {
          props.changePendingStatus(newCommentDisplayObject.id, false);
        })
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

export default memo(InputComment);
