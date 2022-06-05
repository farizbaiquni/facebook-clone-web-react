import { getAuth } from 'firebase/auth'
import React, { Fragment, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import InputTextAddUserProfile from '../components/addUserProfile/InputTextAddUserProfile'

function AddUserProfile() {
  const auth = useContext(AuthContext)
  const [firstName, setFirstName] = useState<string>('')
  
  return (
    <div className=" h-screen flex items-center justify-center container bg-yellow-200">
      <form action="" className=' p-10 rounded-md bg-green-200'>
        <h1 className=' text-left mb-7 text-2xl'>PROFILE : </h1>
        <div className=' flex'>
          <InputTextAddUserProfile
            value={firstName}
            placeholder="FirstName"
            invalid="What's your name?"
            onChangeValue={(value: string) => setFirstName(value)}
          />
        </div>
    </form>
    </div>
  )
}

export default AddUserProfile