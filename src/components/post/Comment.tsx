import { doc, getDoc } from 'firebase/firestore'
import { createRef, Fragment, useEffect, useRef, useState } from 'react'
import { commentType, commentDisplayedType, userProfileType } from '../../constants/EntityType'
import { db } from '../../lib/firebase'

type propsType = {
  comment: commentDisplayedType,
  deleteComment: (deletedIdComment: string) => void,
}

export default function Comment(props: propsType) {

  const [userProfile, setUserProfile] = useState<userProfileType | null>(null)
  const [showOptionComment, setShowOptionComment] = useState(false)
  const ref: React.RefObject<HTMLDivElement> = createRef();


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
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && ref !== null) {
        const cur = ref.current;
        if (cur && !cur.contains(event.target as Node)) {
          setShowOptionComment(false)
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };

  }, [ref])

  return (
    <Fragment>
      {
        userProfile != null && (
          <div className=' flex mt-3 group'>
            <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
            <span className=' flex flex-col'>
              <div className="flex items-center">
                <span className=' flex flex-col px-3 py-2 rounded-lg'>
                  <p className=' text-sm font-semibold text-left'>{userProfile.username}</p>
                  <p className=' text-left'>{props.comment.text}</p>
                </span>
                
                {
                  props.comment.idComment != null && (
                    <div className='relative'>
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setShowOptionComment(prevState => !prevState)} className={`${showOptionComment ? 'block' : 'hidden'} h-4 w-4 ml-3 group-hover:block cursor-pointer`} viewBox="0 0 20 20" fill="gray">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      {
                        showOptionComment && (
                          <div className=' absolute w-72 bg-white rounded-md shadow-md shadow-slate-400 p-2 text-left' ref={ref}>
                            <p className=' font-semibold text-sm hover:bg-slate-300 cursor-pointer py-2 pl-2'>Edit</p>
                            <p className=' font-semibold text-sm hover:bg-slate-300 cursor-pointer py-2 pl-2' onClick={() => props.deleteComment(props.comment.idComment!!)}>Delete</p>
                          </div>
                        )
                      }
                    </div>
                  )
                }
                
              </div>
                <span className=' flex mt-1 px-3'>
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