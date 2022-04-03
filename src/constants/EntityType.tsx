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