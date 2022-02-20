import React from 'react'
import LeftSidebar from '../components/dashboard/LeftSidebar'
import Navbar from '../components/Navbar'
import Story from '../components/dashboard/Story'
import RightSide from '../components/dashboard/RightSide'
import PostInput from '../components/dashboard/PostInput'
import Post from '../components/post/Post'

export default function Dashboard() {
  return (
    <React.Fragment>
        <Navbar />
        <div className=' flex justify-between mt-5'>
            <LeftSidebar />
            <div className="main-content flex flex-col w-600">
                <Story />
                <span className=' w-post m-auto'>
                  <PostInput />
                  <Post />
                </span>
            </div>
            <RightSide />
        </div>

    </React.Fragment>
  )
}