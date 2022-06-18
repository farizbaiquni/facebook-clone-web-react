import { getAuth } from 'firebase/auth'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import InputTextAddUserProfile from '../components/addUserProfile/InputTextAddUserProfile'
import InputDateAddUserProfile from '../components/addUserProfile/InputDateAddUserProfile'
import InputPasswordAddUserProfile from '../components/addUserProfile/InputPasswordAddUserProfile'
import InputRadioAddUserProfile from '../components/addUserProfile/InputRadioAddUserProfile'
import { doc, runTransaction, Timestamp, writeBatch } from 'firebase/firestore'
import { UserContext } from '../contexts/UserContext'

function AddUserProfile() {
  const auth = useContext(AuthContext)
  const user = useContext(UserContext)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<Timestamp | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [nextButtonClicked, setNextButtonClicked] = useState<boolean>(false)

  const handleAddUserProfile = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userRef = doc(db, "users", auth?.uid!);
    const userProfileRef = doc(db, "userProfile", auth?.uid!);
    const userDataUpdate = {
      firstName: firstName, 
      lastName: lastName, 
      birthDate: birthDate, 
      gender: gender, 
    }
    const userDataSet = {
      idUser: auth?.uid,
      firstName: firstName, 
      lastName: lastName, 
      email: auth?.email,
      birthDate: birthDate, 
      photoProfile: '',
      gender: gender, 
      createAt: Timestamp.now(),
      friends: [],
    }
    const userProfileData = {
      idUser: auth?.uid!!, 
      username: firstName + ' ' + lastName, 
      photoUrl: '',
    }
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(userRef);
        if (!sfDoc.exists()) {
          transaction.set(userRef, userDataSet);
          transaction.set(userProfileRef, userProfileData);
        } else {
          transaction.update(userRef, userDataUpdate);
          transaction.set(userProfileRef, userProfileData);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className=" h-screen flex items-center justify-center container w-full">
      <form action="" onSubmit={(event) => { auth?.uid && setNextButtonClicked(true); handleAddUserProfile(event) }} className=' flex flex-col p-7 rounded-md shadow-md shadow-gray-400'>
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
            <InputDateAddUserProfile
                value={birthDate}
                placeholder="Date of Birth"
                invalid="It looks like you've entered the wrong info, Please make sure that you use your real date of birth."
                onChangeValue={(value: Timestamp) => setBirthDate(value)}
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