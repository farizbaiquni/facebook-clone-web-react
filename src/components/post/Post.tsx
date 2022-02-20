import React from 'react'
import ButtonAction from './ButtonAction'
import Comment from './Comment'
import ContentPost from './ContentPost'
import HeaderPost from './HeaderPost'
import InputComment from './InputComment'
import LikePost from './LikePost'
import TextStatusPost from './TextStatusPost'

export default function Post() {
  return (
    <div className="post ml-3 mb-20">
      <HeaderPost />
      <TextStatusPost />
      <ContentPost />
      <LikePost />
      <ButtonAction />
      <Comment />
      <InputComment />
    </div>
  )
}