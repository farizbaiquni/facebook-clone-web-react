export type userType = {
    idUser: String,
    firstName: String,
    lastName: String,
    email: String,
    birthDate: Date, 
    photoProfile: String,
    gender: String,
    createAt: Date,
    friends: Array<String>,
}

export type userProfileType = {
    idUser: string
    photoUrl: string
    name: string
}

export type postType = {
    idPost              : string,
    idUser              : string,
    textPost            : string,
    feeling             : string,
    location            : string,
    tagTotal            : number,
    shareTotal          : number,
    commentTotal        : number,
    createdAt           : Date,
    contentType         : string,
    contentAttachment   : string,
    accessType          : string,
    reactTotalLike      : number,
    reactTotalLove      : number,
    reactTotalCare      : number,
    reactTotalHaha      : number,
    reactTotalWow       : number,
    reactTotalSad       : number,
    reactTotalAngry     : number,
} 


export type commentReactDetails = {
    idUser: string,
    name: string
    photoUrl: string,
    type: reactType,
}


export type reactType = "like" | "love" | "care" | "haha" | "wow" | "sad" | "angry"
export const reactTypeOption = {
    like: "like",
    love: "love",
    care: "care",
    haha: "haha",
    wow: "wow",
    sad: "sad",
    angry: "angry",
}

export type commentType = "text-only" | "photo" | "video" | "gif" | "sticker"
export const commentTypeOption = {
    text: "text-only", 
    photo: "photo", 
    video: "video", 
    gif: "gif", 
    sticker: "sticker",
}


export enum radioGenderOption {
    male = "male",
    female = "female"
}
