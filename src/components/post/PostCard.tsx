import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { memo, useContext, useEffect, useState, useCallback } from "react";
import { postType, commentDisplayType, totalReactPostType } from "../../constants/EntityType";
import { postType as postAccessType } from "../../constants/ModalPostInput";
import { headerPostType } from "../../constants/PostComponentType";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../lib/firebase";
import Comment from "./Comment";
import ContentPost from "./ContentPost";
import HeaderPost from "./HeaderPost";
import InputComment from "./InputComment";
import ReactPost from "./ReactPost";
import TextStatusPost from "./TextStatusPost";

type propsType = {
  post: postType;
  userId: string;
};

function PostCard(props: propsType) {
  console.log("====== RE-RENDER CARD POST - " + props.post.textPost + " ======");

  const userSnapshot = useContext(UserContext);
  const [idNewComments, setIdNewComments] = useState<Array<string>>([]);
  const [helpTrigger, setHelpTrigger] = useState(false);

  const [totalReactPost, setTotalReactPost] = useState<totalReactPostType | null>(null);
  const [isfirstFetchCommentDone, setIsFirstFetchCommentDone] = useState(false);
  const [comments, setComments] = useState<Array<commentDisplayType>>([]);

  let headerPost: headerPostType = {
    username: `${userSnapshot?.firstName} ${userSnapshot?.lastName}`,
    createdAt: props.post.createdAt ? props.post.createdAt : null,
    accessType: props.post.accessType,
  };

  const createCommentDisplayObject = useCallback(
    (comment: QueryDocumentSnapshot<DocumentData>): commentDisplayType => {
      const commentDisplayObject: commentDisplayType = {
        id: comment.id,
        idPost: props.post.idPost,
        idUser: comment.data().idUser,
        replyCommentId: comment.data().replyCommentId,
        text: comment.data().text ?? "",
        attachments: comment.data().attachments,
        attachmentType: comment.data().attachmentType,
        createdAt: comment.data().createdAt,
        reactTotalReply: comment.data().reactTotalReplay ?? 0,
        reactTotalLike: comment.data().reactTotalLike ?? 0,
        reactTotalLove: comment.data().reactTotalLove ?? 0,
        reactTotalCare: comment.data().reactTotalCare ?? 0,
        reactTotalHaha: comment.data().reactTotalHaha ?? 0,
        reactTotalWow: comment.data().reactTotalWow ?? 0,
        reactTotalSad: comment.data().reactTotalSad ?? 0,
        reactTotalAngry: comment.data().reactTotalAngry ?? 0,
        totalReact:
          (comment.data().reactTotalLike ?? 0) +
          (comment.data().reactTotalLove ?? 0) +
          (comment.data().reactTotalCare ?? 0) +
          (comment.data().reactTotalHaha ?? 0) +
          (comment.data().reactTotalWow ?? 0) +
          (comment.data().reactTotalSad ?? 0) +
          (comment.data().reactTotalAngry ?? 0),
        isPending: false,
        totalReply: comment.data().totalReply,
      };
      return commentDisplayObject;
    },
    [props.post.idPost]
  );

  const handleTotalReactPost = useCallback(() => {
    const tempObject = {
      totalComment: props.post.commentTotal,
      totalShare: props.post.shareTotal,
      totalLike: props.post.reactTotalLike,
      totalLove: props.post.reactTotalLove,
      totalCare: props.post.reactTotalCare,
      totalHaha: props.post.reactTotalHaha,
      totalWow: props.post.reactTotalWow,
      totalSad: props.post.reactTotalSad,
      totalAngry: props.post.reactTotalAngry,
      totalReact: props.post.reactTotal,
    };
    setTotalReactPost(tempObject);
  }, [props.post]);

  const firstFetchComment = useCallback(async () => {
    try {
      const queryTask = query(
        collection(db, "comments", props.post.idPost, "comment"),
        orderBy("createdAt"),
        limit(1)
      );
      const querySnapshot = await getDocs(queryTask);
      let tempComments: Array<commentDisplayType> = [];
      querySnapshot.forEach((comment) => {
        if (comment.id !== null) {
          const newCommentObject = createCommentDisplayObject(comment);
          tempComments.push(newCommentObject);
          setIsFirstFetchCommentDone(true);
        }
      });
      setComments(tempComments);
    } catch (error) {}
  }, [createCommentDisplayObject, props.post.idPost]);

  const addNewComment = useCallback((id: string, newComment: commentDisplayType) => {
    try {
      setIdNewComments((prevState) => [...prevState, id]);
      setComments((prevState) => [...prevState, newComment]);
    } catch (error) {}
  }, []);

  const changePendingStatus = useCallback((key: string, isPending: boolean) => {
    try {
      setComments((prevState) => {
        const newState = prevState.map((comment) => {
          if (comment.id === key) {
            return { ...comment, isPending: isPending };
          }
          return comment;
        });
        return newState;
      });
      setHelpTrigger((prevState) => !prevState);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!isfirstFetchCommentDone) {
      firstFetchComment();
    }
  }, [firstFetchComment, isfirstFetchCommentDone, userSnapshot]);

  useEffect(() => {
    handleTotalReactPost();
  }, [handleTotalReactPost, props.post]);

  return (
    <div className="post mb-10 w-600 rounded-md border-0 border-gray-400 bg-white p-5 shadow-sm shadow-slate-400">
      <HeaderPost headerPost={headerPost} />
      <TextStatusPost textStatusPost={props.post.textPost} />
      {props.post.contentType !== postAccessType.textOnly &&
        props.post.contentType !== null &&
        props.post.accessType !== undefined && <ContentPost />}

      {totalReactPost === null ? (
        <div className="flex justify-center">
          <img src={process.env.PUBLIC_URL + "./loading_blue.gif"} alt="" className="h-6 w-6" />
        </div>
      ) : (
        <ReactPost
          totalReactPost={totalReactPost}
          idPost={props.post.idPost}
          idUser={props.userId}
        />
      )}

      <InputComment
        userId={props.userId}
        idPost={props.post.idPost}
        addNewComment={addNewComment}
        changePendingStatus={changePendingStatus}
      />

      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
}

export default memo(PostCard);
