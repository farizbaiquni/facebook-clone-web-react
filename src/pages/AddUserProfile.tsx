import { getAuth } from 'firebase/auth'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import InputTextAddUserProfile from '../components/addUserProfile/InputTextAddUserProfile'
import InputDateAddUserProfile from '../components/addUserProfile/InputDateAddUserProfile'
import InputPasswordAddUserProfile from '../components/addUserProfile/InputPasswordAddUserProfile'
import InputRadioAddUserProfile from '../components/addUserProfile/InputRadioAddUserProfile'

function AddUserProfile() {
  const auth = useContext(AuthContext)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPasword] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')
  const [gender, setGender] = useState<string | null>(null)
  const [nextButtonClicked, setNextButtonClicked] = useState<boolean>(false)
  
  const handleAddUserProfile = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className=" h-screen flex items-center justify-center container w-full">
      <form action="" onSubmit={(event) => { setNextButtonClicked(true); handleAddUserProfile(event)}} className=' flex flex-col p-7 rounded-md shadow-md shadow-gray-400'>
        <h1 className=' text-left mb-7 text-3xl font-bold'>Profile : </h1>
        <ul>
          <li className=' flex'>
            <InputTextAddUserProfile
                value={lastName}
                placeholder="Surname"
                invalid="What's your name?"
                onChangeValue={(value: string) => setLastName(value)}
                invalidLeftPosition = {true}
                nextButtonClicked = {nextButtonClicked}
              />
            <span className=' ml-2'>
              <InputTextAddUserProfile
                  value={firstName}
                  placeholder="FirstName"
                  invalid="What's your name?"
                  onChangeValue={(value: string) => setFirstName(value)}
                  invalidLeftPosition = {false}
                  nextButtonClicked = {nextButtonClicked}
                />
            </span>
          </li>
          <li className=' mt-3'>
            <InputTextAddUserProfile
              value={lastName}
              placeholder="Email"
              invalid="You'II use this when you log in and if your ever need to reset your password"
              onChangeValue={(value: string) => setLastName(value)}
              invalidLeftPosition = {true}
              nextButtonClicked = {nextButtonClicked}
            />
          </li>
          <li className=' mt-3'>
            <InputPasswordAddUserProfile
              value={lastName}
              placeholder="New Password"
              invalid="Enter a combination of at least six numbers, letters, punchtuation marks (such as ! and &)."
              onChangeValue={(value: string) => setLastName(value)}
              nextButtonClicked = {nextButtonClicked}
            />
          </li>
          <li className=' mt-3'>
            <InputDateAddUserProfile
                value={lastName}
                placeholder="Date of Birth"
                invalid="It looks like you've entered the wrong info, Please make sure that you use your real date of birth."
                onChangeValue={(value: string) => setLastName(value)}
                nextButtonClicked = {nextButtonClicked}
            />
          </li>
          <li className=' mt-3'>
            <InputRadioAddUserProfile
                value={gender}
                placeholder="Gender"
                invalid="Please choose a gender, You can change who can see this later."
                onChangeValue={(value: string) => setGender(value)}
                nextButtonClicked = {nextButtonClicked}
            />
          </li>
        </ul>
        <span className=' w-full flex justify-center mt-10'>
          
          <button type="submit" className="py-2 px-14 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ">
              Next
          </button>

        </span>
    </form>
    </div>
  )
}

export default AddUserProfile