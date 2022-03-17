import React from 'react'
import LeftSidebar from '../components/dashboard/LeftSidebar'
import Navbar from '../components/navbar/Navbar'
import Stories from '../components/dashboard/Stories'
import RightSidebar from '../components/dashboard/RightSidebar'
import PostInput from '../components/PostInput/PostInput'
import Post from '../components/post/Post'
import SuggestedFriends from '../components/dashboard/SuggestedFriends'

export default function Dashboard() {

  return (
    <React.Fragment>
        <Navbar />
        <div className=' flex justify-between mt-5'>
            <LeftSidebar />
            <div className="main-content flex flex-col w-600 mx-5 mb-36">
                <Stories />
                <span className=' w-post m-auto'>
                  <PostInput />
                  <Post />
                  <SuggestedFriends />
                </span>
            </div>
            <RightSidebar />
        </div>

    </React.Fragment>
  )
}