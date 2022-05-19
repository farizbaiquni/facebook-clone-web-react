import React, { Fragment, useContext } from 'react'
import LeftSidebar from '../components/dashboard/LeftSidebar'
import Navbar from '../components/navbar/Navbar'
import Stories from '../components/dashboard/Stories'
import RightSidebar from '../components/dashboard/RightSidebar'
import PostInput from '../components/PostInput/PostInput'
import Post from '../components/post/Post'
import SuggestedFriends from '../components/dashboard/SuggestedFriends'
import { AuthContext } from '../contexts/AuthContext'

export default function Dashboard() {
  let auth = useContext(AuthContext)
  return (
    <Fragment>
      <Navbar />
      <div className=' flex justify-between pt-5 bg-gray-100'>
          <LeftSidebar />
          <div className="main-content flex flex-col w-700px items-center mx-5 mb-36">
              <Stories />
              <span className=' w-post m-auto flex flex-col items-center'>
                <PostInput />
                {
                  (auth !== null) && <Post />
                }
                <SuggestedFriends />
              </span>
          </div>
          <RightSidebar />
      </div>
    </Fragment>
  )
}