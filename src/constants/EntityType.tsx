export type userType = {
    firstName?: String,
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
    username            : string,
    textPost            : string,
    feeling             : string,
    location            : string,
    tagTotal            : number,
    tagNames            : Array<string>,
    createdAt           : Date,
    contentType         : string,
    contentAttachment   : string,
    accessType          : string,
    shareTotal          : number,
    shareNames          : Array<string>,
    reactTotalLike      : number,
    reactTotalLove      : number,
    reactTotalCare      : number,
    reactTotalHaha      : number,
    reactTotalWow       : number,
    reactTotalSad       : number,
    reactTotalAngry     : number,
    reactNamesLike      : Array<string>,
    reactNamesLove      : Array<string>,
    reactNamesCare      : Array<string>,
    reactNamesHaha      : Array<string>,
    reactNamesWow       : Array<string>,
    reactNamesSad       : Array<string>,
    reactNamesAngry     : Array<string>,
} 

export type defaultDisplayedComment = {
     commentIdUser         : string,
     commentText           : string,
     commentContentAttachment : string
     commentCreatedAt      : Date,
     commentReplay         : Array<string>,
     commentTotalLike     : number,
     commentTotalLove     : number,
     commentTotalCare     : number,
     commentTotalHaha     : number,
     commentTotalWow      : number,
     commentTotalSad      : number,
     commentTotalAngry    : number,
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
