import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { commentDisplayType } from "../constants/EntityType";

export const createCommentDisplayObjectFromDocument = (
  comment: QueryDocumentSnapshot<DocumentData>,
  idPost: string
): commentDisplayType => {
  const commentDisplayObject: commentDisplayType = {
    id: comment.id,
    idPost: idPost,
    idUser: comment.data().idUser,
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
};
