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
import { postType, commentDisplayType } from "../../constants/EntityType";
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

  const userSnapshot = useContext(UserContext);
  const [loadingProcessReact, setLoadingProcessReact] = useState<boolean>(false);
  const [firstFetchCommentDone, setFirstFetchCommentDone] = useState(false);
  const [idNewComments, setIdNewComments] = useState<Array<string>>([]);
  const [helpTrigger, setHelpTrigger] = useState(false);

  const [comments, setComments] = useState<Array<commentDisplayType>>([]);

  let headerPost: headerPostType = {
    username: `${userSnapshot?.firstName} ${userSnapshot?.lastName}`,
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

  const createCommentObject = useCallback(
    (comment: QueryDocumentSnapshot<DocumentData>): commentDisplayType => {
      const commentObject: commentDisplayType = {
        id: comment.id,
        idPost: props.post.idPost,
        idUser: comment.data().idUser,
        replyCommentId: comment.data().replyCommentId,
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
        isPending: false,
        totalReply: comment.data().totalReply,
      };
      return commentObject;
    },
    [props.post.idPost]
  );

  const firstFetchComment = useCallback(async () => {
    const queryTask = query(
      collection(db, "comments", props.post.idPost, "comment"),
      orderBy("createdAt"),
      limit(1)
    );
    const querySnapshot = await getDocs(queryTask);
    let tempComments: Array<commentDisplayType> = [];
    querySnapshot.forEach((comment) => {
      if (comment.id !== null) {
        const newCommentObject = createCommentObject(comment);
        tempComments.push(newCommentObject);
        setFirstFetchCommentDone(true);
      }
    });
    setComments(tempComments);
  }, [createCommentObject, props.post.idPost]);

  const addNewComment = useCallback((id: string, newComment: commentDisplayType) => {
    setIdNewComments((prevState) => [...prevState, id]);
    setComments((prevState) => [...prevState, newComment]);
  }, []);

  const changePendingStatus = useCallback((key: string, isPending: boolean) => {
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
  }, []);

  useEffect(() => {
    if (firstFetchCommentDone === false) {
      firstFetchComment();
    }
  }, [firstFetchComment, firstFetchCommentDone, userSnapshot]);

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
