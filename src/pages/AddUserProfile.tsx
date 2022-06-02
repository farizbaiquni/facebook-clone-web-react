import { getAuth } from 'firebase/auth'
import React, { Fragment, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Input from '../components/addUserProfile/Input'

function AddUserProfile() {
  const auth = useContext(AuthContext)
  
  return (
    <div className=" h-screen flex items-center justify-center container bg-yellow-200">
      <form action="" className=' p-10 rounded-md bg-green-200'>
        <h1 className=' text-left mb-7 text-2xl'>PROFILE : </h1>
        <Input />
    </form>
    </div>
  )
}

export default AddUserProfile