import { Timestamp } from "firebase/firestore";

export type userType = {
  idUser: String;
  firstName: String;
  lastName: String;
  email: String;
  birthDate: Date;
  photoProfile: String;
  gender: String;
  createAt: Date;
  friends: Array<String>;
};

export type userProfileType = {
  idUser: string;
  photoUrl: string;
  username: string;
};

export type postType = {
  idPost: string;
  idUser: string;
  textPost: string;
  feeling: string;
  location: string;
  tagTotal: number;
  shareTotal: number;
  commentTotal: number;
  createdAt: Date;
  contentType: string;
  contentAttachment: string;
  accessType: string;
  reactTotalLike: number;
  reactTotalLove: number;
  reactTotalCare: number;
  reactTotalHaha: number;
  reactTotalWow: number;
  reactTotalSad: number;
  reactTotalAngry: number;
  reactTotal: number;
};

export enum commentAttachmentEnum {
  TextOnly,
  Photo,
  Video,
  Gif,
  Sticker,
}
export const commentAttachmentTypeOption = {
  text: "text-only",
  photo: "photo",
  video: "video",
  gif: "gif",
  sticker: "sticker",
};

export enum radioGenderOption {
  male = "male",
  female = "female",
}

export type commentType = {
  idUser: string;
  text: string;
  attachments: string[] | null;
  attachmentType: commentAttachmentEnum;
  createdAt: Timestamp;
  reactTotalReply: number;
  reactTotalLike: number;
  reactTotalLove: number;
  reactTotalCare: number;
  reactTotalHaha: number;
  reactTotalWow: number;
  reactTotalSad: number;
  reactTotalAngry: number;
  totalReply: number;
};

export type commentDisplayType = {
  id: string;
  idPost: string;
  idUser: string;
  text: string;
  attachments: string[] | null;
  attachmentType: commentAttachmentEnum;
  createdAt: Timestamp;
  reactTotalReply: number;
  reactTotalLike: number;
  reactTotalLove: number;
  reactTotalCare: number;
  reactTotalHaha: number;
  reactTotalWow: number;
  reactTotalSad: number;
  reactTotalAngry: number;
  totalReact: number;
  isPending: boolean;
  totalReply: number;
};

export type commentReplyType = {
  idUser: string;
  replyCommentId: string;
  replyCommentIdUser: string;
  text: string;
  attachments: string[] | null;
  attachmentType: commentAttachmentEnum;
  createdAt: Timestamp;
  reactTotalReply: number;
  reactTotalLike: number;
  reactTotalLove: number;
  reactTotalCare: number;
  reactTotalHaha: number;
  reactTotalWow: number;
  reactTotalSad: number;
  reactTotalAngry: number;
  totalReply: number;
};

export type commentDisplayReplyType = {
  id: string;
  idPost: string;
  idUser: string;
  replyCommentId: string;
  replyCommentIdUser: string;
  text: string;
  attachments: string[] | null;
  attachmentType: commentAttachmentEnum;
  createdAt: Timestamp;
  reactTotalReply: number;
  reactTotalLike: number;
  reactTotalLove: number;
  reactTotalCare: number;
  reactTotalHaha: number;
  reactTotalWow: number;
  reactTotalSad: number;
  reactTotalAngry: number;
  totalReact: number;
  isPending: boolean;
  totalReply: number;
};

export type userReactPostType = {
  usersReactType: Map<string, number>;
};

export enum reactEnum {
  LIKE,
  LOVE,
  CARE,
  HAHA,
  WOW,
  SAD,
  ANGRY,
}

export type totalReactPostType = {
  totalComment: number;
  totalShare: number;
  totalLike: number;
  totalLove: number;
  totalCare: number;
  totalHaha: number;
  totalWow: number;
  totalSad: number;
  totalAngry: number;
  totalReact: number;
};
