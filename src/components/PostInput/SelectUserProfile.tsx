import React, { memo, useState } from 'react'

type userProfileType = {
    key: string,
    friend: {
      idUser: string
      photoUrl: string
      name: string
    },
    type: 'except' | 'specific',
    addAccessExceptions: (data: String) => void,
    removeAccesExceptions: (data: String) => void,
}

function SelectUserProfile(props: userProfileType) {
  
  const [isChecked, setIsChecked] = useState(false)
  const [exceptIconColor, setExceptIconColor] = useState('gray')

  const handleChecked = () => {
    if(isChecked){
      props.removeAccesExceptions(props.friend.idUser)
    } else {
      props.addAccessExceptions(props.friend.idUser)
    }
    setIsChecked(!isChecked)
  }

  return (
    <div className=' flex items-center py-3 cursor-pointer group mx-1' 
      onClick={ () => handleChecked()}
      onMouseOver={() => (!isChecked && props.type === 'except') && setExceptIconColor('red')} 
      onMouseLeave={() => (!isChecked && props.type === 'except') && setExceptIconColor('gray') }
    >

      { 
        (props.friend.photoUrl.length <= 0) ? (<img src={process.env.PUBLIC_URL + './example_story.jpg'} alt="facebook" className=' rounded-full w-9 h-9' /> ) : ( <img src={props.friend.photoUrl} alt="facebook" className=' rounded-full w-9 h-9' /> )
      }

      <h1 className=' flex-1 ml-3 font-semibold line-clamp-1'>{props.friend.name}</h1>

      {
        props.type === 'except' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 rounded-full border-2 ${isChecked ? ' border-red-500 bg-red-500' : 'border-slate-400'} group-hover:border-red-500`} viewBox="0 0 20 20" fill={`${isChecked ? 'white' : exceptIconColor}`}>
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={`${isChecked ? '#2563eb' : 'white'}`} viewBox="0 0 24 24" stroke={`${isChecked ? 'white' : 'gray'}`} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
      }
      
    </div>
  )
  
}

export default memo(SelectUserProfile)