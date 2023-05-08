import React, { Fragment, useContext } from "react";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import Navbar from "../components/navbar/Navbar";
import Stories from "../components/dashboard/Stories";
import RightSidebar from "../components/dashboard/RightSidebar";
import PostInput from "../components/PostInput/PostInput";
import Post from "../components/post/Post";
import SuggestedFriends from "../components/dashboard/SuggestedFriends";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard() {
  let auth = useContext(AuthContext);
  return (
    <div>
      <Navbar />
      <div className=" flex justify-between bg-gray-100 pt-5">
        <LeftSidebar />
        <div className="main-content mx-5 mb-36 flex w-700px flex-col items-center">
          <Stories />
          <span className=" m-auto flex w-post flex-col items-center">
            <PostInput />
            <SuggestedFriends />
            {auth !== null && <Post />}
          </span>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}
