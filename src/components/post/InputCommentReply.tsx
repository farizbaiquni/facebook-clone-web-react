import { memo, useEffect, useState } from "react";
import {
  commentAttachmentEnum,
  commentDisplayReplyType,
  commentReplyType,
} from "../../constants/EntityType";
import { v4 as uuidv4 } from "uuid";
import { Timestamp, doc, increment, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";

type PropsType = {
  idUser: string;
  replyCommentId: string;
  replyCommentIdUser: string;
  idPost: string;
  addNewComment: (id: string, comment: commentDisplayReplyType) => void;
  changePendingStatus: (previusId: string, newId: string, isPending: boolean) => void;
};

function InputCommentReply(props: PropsType) {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileDataURL, setFileDataURL] = useState<string | null>(null);

  const [attachmentType, setAttachmentType] = useState<commentAttachmentEnum>(
    commentAttachmentEnum.TextOnly
  );

  const createCommentReplyObject = (): commentReplyType => {
    const object: commentReplyType = {
      idUser: props.idUser,
      replyCommentId: props.replyCommentId,
      replyCommentIdUser: props.replyCommentIdUser,
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

  const createCommenDisplaytReplyObject = (): commentDisplayReplyType => {
    const uuid = uuidv4();
    const object: commentDisplayReplyType = {
      id: uuid,
      idPost: props.idPost,
      idUser: props.idUser,
      replyCommentId: props.replyCommentId,
      replyCommentIdUser: props.replyCommentIdUser,
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
      try {
        const batch = writeBatch(db);
        const commentsRef = doc(db, "comments", props.idPost, "comment", props.replyCommentId);
        const commentsReplyRef = doc(
          db,
          "comments",
          props.idPost,
          "commentReply",
          props.replyCommentId
        );
        const newCommentReplyObject = createCommentReplyObject();
        const newCommentDisplayReplyObject = createCommenDisplaytReplyObject();
        setText("");
        props.addNewComment(newCommentDisplayReplyObject.id, newCommentDisplayReplyObject);
        batch.update(commentsRef, "totalReply", increment(1));
        batch.set(commentsReplyRef, newCommentReplyObject);
        await batch
          .commit()
          .then((doc) =>
            props.changePendingStatus(newCommentDisplayReplyObject.id, commentsReplyRef.id, false)
          );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && !file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file || null);
  };

  const removeImage = () => {
    setFile(null);
    setFileDataURL(null);
  };

  useEffect(() => {
    let fileReader: FileReader | null;
    let isCancel = false;

    //Get input image f
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target as FileReader;
        if (result && !isCancel) {
          setFileDataURL(result.toString());
        }
      };
      fileReader.readAsDataURL(file);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  return (
    <div className="mt-3 flex py-2">
      <img
        src={process.env.PUBLIC_URL + "./profile.jpg"}
        alt=""
        className=" mr-2 h-8 w-8 rounded-full"
      />
      <div className="flex w-full flex-col">
        <div className="flex flex-1 flex-col rounded-xl bg-gray-100 px-3 py-2 focus:outline-none">
          <input
            value={text}
            type="text"
            placeholder="Write a comment..."
            className="mt-2 h-full w-full bg-gray-100 focus:outline-none"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleAddComment}
          />

          <div className="mb-2 mt-5 flex justify-between">
            <div className="flex">
              <img
                src={process.env.PUBLIC_URL + "./icons/user.png"}
                alt=""
                className={`mr-2 h-5 w-5 cursor-pointer fill-slate-500 ${fileDataURL && "hidden"}`}
              />
              <img
                src={process.env.PUBLIC_URL + "./icons/emoji.png"}
                alt=""
                className="mr-2 h-5 w-5 cursor-pointer"
              />
              <div className={`mr-2 ${fileDataURL && "hidden"}`}>
                <input
                  className="hidden h-5 w-5 bg-blue-500"
                  type="file"
                  id="upload-image"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => changeHandler(e)}
                />
                <label htmlFor="upload-image">
                  <img
                    src={process.env.PUBLIC_URL + "./icons/camera.png"}
                    alt=""
                    className="h-5 w-5 cursor-pointer"
                  />
                </label>
              </div>
              <img
                src={process.env.PUBLIC_URL + "./icons/gif.png"}
                alt=""
                className={`mr-2 h-5 w-5 cursor-pointer fill-slate-500 ${fileDataURL && "hidden"}`}
              />
              <img
                src={process.env.PUBLIC_URL + "./icons/sticker.png"}
                alt=""
                className={`h-5 w-5 -rotate-12  cursor-pointer fill-slate-500 ${
                  fileDataURL && "hidden"
                }`}
              />
            </div>
            <img
              src={process.env.PUBLIC_URL + "./icons/send.png"}
              alt=""
              className={`h-5 w-5 cursor-pointer fill-slate-500 ${fileDataURL && "hidden"}`}
            />
          </div>
        </div>
        {fileDataURL && (
          <div className="mt-2 flex w-full justify-between">
            <img src={fileDataURL} alt="preview" className="h-28 w-40 object-cover" />
            <img
              onClick={() => removeImage()}
              src={process.env.PUBLIC_URL + "./icons/close.png"}
              alt=""
              className="mx-2 h-7 w-7 cursor-pointer rounded-full bg-slate-300 p-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(InputCommentReply);
