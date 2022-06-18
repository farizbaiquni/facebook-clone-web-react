import { doc, getDoc } from 'firebase/firestore'
import { Fragment, useEffect, useState } from 'react'
import { commentType, userProfileType } from '../../constants/EntityType'
import { db } from '../../lib/firebase'

type propsType = {
  comment: commentType
}

export default function Comment(props: propsType) {

  const [userProfile, setUserProfile] = useState<userProfileType | null>(null)
  
  const fetchUserProfile = async() => {
    const docRef = doc(db, "userProfile", props.comment.idUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tempUserProfile: userProfileType = {
        idUser: docSnap.data().idUser,
        photoUrl: docSnap.data().photoUrl,
        username: docSnap.data().username
      }
      setUserProfile(tempUserProfile)

    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  return (
    <Fragment>
      {
        userProfile != null && (
          <div className=' flex mt-3'>
            <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
            <span className=' flex flex-col ml-2'>
                <span className=' flex flex-col bg-gray-100 px-5 py-2 rounded-lg'>
                  <p className=' text-sm font-semibold text-left'>{userProfile.username}</p>
                  <p className=' text-left'>{props.comment.text}</p>
                </span>
                <span className=' flex mt-1 pl-5'>
                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Like</p>
                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Reply</p>
                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline'>See translation</p>
                </span>
            </span>
        </div>
        )
      }
      
    </Fragment>
  )
}