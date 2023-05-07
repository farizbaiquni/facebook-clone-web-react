import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  Timestamp,
  DocumentData,
  where,
} from "firebase/firestore";
import { memo, useContext, useEffect, useState, useCallback } from "react";
import {
  postType,
  reactTypeOption,
  commentType,
  commentDisplayType,
} from "../../constants/EntityType";
import { postType as postAccessType } from "../../constants/ModalPostInput";
import { headerPostType, reactPostsType } from "../../constants/PostComponentType";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../lib/firebase";
import ButtonAction from "./ButtonAction";
import Comment from "./Comment";
import ContentPost from "./ContentPost";
import HeaderPost from "./HeaderPost";
import InputComment from "./InputComment";
import ReactPost from "./ReactPost";
import TextStatusPost from "./TextStatusPost";

type propsType = {
  post: postType;
  userId: string;
  reactPosts: reactPostsType | null | undefined;
};

function PostCard(props: propsType) {
  console.log("====== RE-RENDER CARD POST - " + props.post.textPost + " ======");

  const user = useContext(UserContext);
  const [loadingProcessReact, setLoadingProcessReact] = useState<boolean>(false);
  const [firstFetchCommentDone, setFirstFetchCommentDone] = useState(false);
  const [idNewComments, setIdNewComments] = useState<Array<string>>([]);

  const [comments, setComments] = useState<Array<commentDisplayType>>([]);
  const [errorNewComments, setErrorNewComments] = useState<string[]>([]);

  let headerPost: headerPostType = {
    username: `${user?.firstName} ${user?.lastName}`,
    createdAt: props.post.createdAt ? props.post.createdAt : null,
    accessType: props.post.accessType,
  };

  let totalReact =
    props.post.reactTotalAngry +
    props.post.reactTotalCare +
    props.post.reactTotalHaha +
    props.post.reactTotalLike +
    props.post.reactTotalLove +
    props.post.reactTotalSad +
    props.post.reactTotalWow;

  const createCommentObject = (
    comment: QueryDocumentSnapshot<DocumentData>
  ): commentDisplayType => {
    const commentObject: commentDisplayType = {
      id: comment.id,
      idUser: comment.data().idUser,
      idPost: comment.data().idPost,
      text: comment.data().text ?? "",
      attachments: comment.data().attachments,
      attachmentType: comment.data().attachmentType,
      createdAt: comment.data().createdAt,
      reactTotalReplay: comment.data().reactTotalReplay ?? 0,
      reactTotalLike: comment.data().reactTotalLike ?? 0,
      reactTotalLove: comment.data().reactTotalLove ?? 0,
      reactTotalCare: comment.data().reactTotalCare ?? 0,
      reactTotalHaha: comment.data().reactTotalHaha ?? 0,
      reactTotalWow: comment.data().reactTotalWow ?? 0,
      reactTotalSad: comment.data().reactTotalSad ?? 0,
      reactTotalAngry: comment.data().reactTotalAngry ?? 0,
      pending: false,
    };
    return commentObject;
  };

  const firstFetchComment = async () => {
    const queryTask = query(
      collection(db, "comments", props.post.idPost, "commentList"),
      where("idPost", "==", props.post.idPost),
      orderBy("createdAt"),
      limit(1)
    );
    const querySnapshot = await getDocs(queryTask);
    let tempComments: Array<commentDisplayType> = [];
    querySnapshot.forEach((comment) => {
      console.log(comment.data());
      if (comment.id !== null) {
        const newCommentObject = createCommentObject(comment);
        tempComments.push(newCommentObject);
        setFirstFetchCommentDone(true);
      }
    });
    setComments(tempComments);
  };

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const addNewComment = (id: string, newComment: commentDisplayType) => {
    setIdNewComments((prevState) => [...prevState, id]);
    setComments((prevState) => [...prevState, newComment]);
  };

  const changePendingStatus = (key: string) => {
    setComments((prevState) => {
      const newState = prevState.map((comment) => {
        if (comment.id === key) {
          return { ...comment, pending: false };
        }
        return comment;
      });
      return newState;
    });
  };

  useEffect(() => {
    if (firstFetchCommentDone === false) {
      firstFetchComment();
    }
  }, [user]);

  return (
    <div className="post mb-10 w-600 rounded-md border-0 border-gray-400 bg-white p-5 shadow-sm shadow-slate-400">
      <HeaderPost headerPost={headerPost} />
      <TextStatusPost textStatusPost={props.post.textPost} />
      {props.post.contentType !== postAccessType.textOnly &&
        props.post.contentType !== null &&
        props.post.accessType !== undefined && <ContentPost />}

      <ReactPost
        totalReact={totalReact}
        reactTotalLike={props.post.reactTotalLike}
        reactTotalLove={props.post.reactTotalLove}
        reactTotalCare={props.post.reactTotalCare}
        reactTotalHaha={props.post.reactTotalHaha}
        reactTotalWow={props.post.reactTotalWow}
        reactTotalSad={props.post.reactTotalSad}
        reactTotalAngry={props.post.reactTotalAngry}
      />

      <ButtonAction
        userId={props.userId}
        // handleAddLike={handleAddLike}
        // handleRemoveLike={handleRemoveLike}
        loadingProcessReact={loadingProcessReact}
      />

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
