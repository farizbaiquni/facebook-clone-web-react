import React, { memo } from 'react'
import { monthInEnglish } from '../../constants/DateArray'
import { headerPostType } from '../../constants/PostComponentType'

type propsType = {
  headerPost: headerPostType
}

function HeaderPost(props: propsType) {
  return (
    <div className="header_post flex items-center">
      <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-10 w-10 rounded-full cursor-pointer' />
      <span className=' flex flex-col ml-3'>
        <p className=' font-medium hover:underline hover:underline-offset-2 cursor-pointer text-left'>{props.headerPost.username}</p>
          {
            props.headerPost.createdAt && (
              <span className=' flex text-xs mt-1 text-gray-500 hover:underline hover:underline-offset-2 cursor-pointer'>
                <p>{monthInEnglish[props.headerPost.createdAt.getMonth()]}&nbsp;</p>
                <p>{props.headerPost.createdAt.getDate()}</p>
                {
                  ( new Date().getFullYear() === props.headerPost.createdAt.getFullYear()) && (
                      <p>, {props.headerPost.createdAt.getFullYear()}</p>
                  )
                }
              </span>
            )
          }
      </span>
    </div>
  )
}

export default memo(HeaderPost)