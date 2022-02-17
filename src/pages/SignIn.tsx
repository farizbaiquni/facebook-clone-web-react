import React, { useContext } from 'react'
import Modal from 'react-modal';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, EmailAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseContext } from '../contexts/firebaseContext';

const customStyles = {
    overlay: {
        backgroundColor: 'rgb(255, 255, 255, 0.8)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};



export const SignIn = () => {
    useContext(FirebaseContext)
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    const auth = getAuth()
 
    const handleSignUp = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage + "Error Code : " + errorCode )
            })
    }

    const handleEmailExist = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await fetchSignInMethodsForEmail( auth, email)
            .then((signInMethods) => {
                if (signInMethods.indexOf(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
                    alert("Email Exist")
                }else{
                    handleSignUp()
                }
            })
            .catch((error) => {
                alert(error)
            })
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                // const user = userCredential.user;
                alert("login success")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    //Form input
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [birthDate, setBirthDate] = React.useState("")
    const [gender, setGender] = React.useState("")

    const [loginEmail, setLoginEmail] = React.useState("")
    const [loginPassword, setLoginPassword] = React.useState("")

    const [clickedInput, setClickedInput] = React.useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        birthDate: false,
        gender: false,
    })

    const [focusInput, setFocusInput] = React.useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        birthDate: false,
        gender: false,
    })

    const templateFocusFalse = {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        birthDate: false,
        gender: false,
    }

    return (
        <main className='flex flex-col justify-center items-center h-100vh min-lg:flex-row'>

            <div className="left_side w-500 lg:w-600">
                <img src={process.env.PUBLIC_URL + './facebook_text.svg'} alt="facebook" className=' w-80 max-lg:mx-auto' />
                <h1 className='text-3xl text-left min-lg:ml-8 max-lg:text-2xl max-lg:text-justify min-lg:tracking-wide'>Facebook helps you connect and share with the people in your life.</h1>
            </div>

            <div className="right_side">
                <form action="" className='w-500 border-2 border-slate-300 pt-14 pb-8 px-5 rounded-md' onSubmit={ e => handleLogin(e)}>

                    <input typeof='email' id="inputEmail" className="rounded-md border-transparent flex-1 appearance-none border border-gray-300 w-full py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent" name="email" placeholder="Email address or phone number"onChange={(event) => setLoginEmail(event.target.value)} />

                    <input typeof='password' type="password" id="inputPassword" className="rounded-md border-transparent flex-1 appearance-none border border-gray-300 w-full py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent mt-3" name="password" placeholder="Password" onChange={ (event) => setLoginPassword(event.target.value)}/>

                    
                    <button type="submit" className="py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-indigo-200 text-white text-lg font-bold w-full transition ease-in duration-200 text-center shadow-md focus:outline-none focus:0 ring-2 focus:ring-offset-2 rounded-lg mt-5">
                        Log In
                    </button>

                    <p className=' text-sm text-blue-600 mt-3 cursor-pointer'>Forgotten password ?</p>

                    <button type="button" className="py-3 px-4 bg-green-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-indigo-200 text-white text-md font-bold transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-9" onClick={openModal}>
                        Create New Account
                    </button>

                </form>
                    <p className='text-sm mt-5'><span className=' font-semibold cursor-pointer'>Create a Page</span> for a celebrity, brand or business.</p>
            </div>            


            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Sign Up"
                ariaHideApp={false}
            >    
                <form action="form-sign-up" className='flex flex-col' onSubmit={ (e) => {
                        if (firstName.length <= 0 || lastName.length <= 0 || email.length <= 0 || password.length <= 0 || birthDate.length <= 0 || gender.length <= 0) {
                            setClickedInput({...clickedInput, firstName: true, lastName: true, email: true, password: true, birthDate: true, gender: true,})
                        } else {
                            handleEmailExist(e)
                        }
                    }}>
                    <h1 className='text-3xl font-semibold'>Sign Up</h1>
                    <h2 className=' text-sm mt-1 text-gray-500'>It's quick and easy.</h2>

                    <hr className='bg-slate-300 my-5' />

                    <div className='flex'>
                        {/* first name */}
                        <div className=" relative ">
                            <input type="text" className={`ring-gray-300 ring-1 rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent ${(firstName.length <= 0 && clickedInput.firstName === true && focusInput.firstName === false) && 'border-red-500'}`} autoComplete='off' name="email" placeholder="First name" value={`${firstName}`} onChange={(event) => setFirstName(event.target.value)} onFocus={() => { 
                                setFocusInput({...templateFocusFalse, firstName: true}); 
                                !clickedInput.firstName && setClickedInput({...clickedInput, firstName: true})
                                }}/>
                            <span className={`${(firstName.length <= 0 && clickedInput.firstName === true && focusInput.firstName === false) ? 'block' : 'hidden'}`}>
                                <InvalidInputIcon />
                                <p className="absolute left-2 text-sm text-red-500 -bottom-5">
                                    What's your name?
                                </p>
                            </span>       
                        </div>

                        {/* surname */}
                        <div className=" ml-2 relative ">
                            <input type="text" className={`ring-gray-300 ring-1 rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent ${ (lastName.length <= 0 && clickedInput.lastName === true && focusInput.lastName === false) && 'border-red-500'}`} autoComplete='off' name="email" placeholder="Surname" value={`${lastName}`} onChange={(event) => setLastName(event.target.value)} onFocus={() => {
                                setFocusInput({...templateFocusFalse, lastName: true})
                                !clickedInput.lastName && setClickedInput({...clickedInput, lastName: true})
                                }}/>
                            <span className={`${(lastName.length <= 0 && clickedInput.lastName === true && focusInput.lastName === false) ? 'block' : 'hidden'}`}>
                                <InvalidInputIcon />
                                <p className="absolute left-2 text-sm text-red-500 -bottom-5">
                                    What's your name?
                                </p>
                            </span>
                        </div>
                    </div>

                    {/* email */}
                    <div className=" relative mt-8">
                        <input type="text" className={`ring-gray-300 ring-1 rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent ${(email.length <= 0 && clickedInput.email === true && focusInput.email === false) && 'border-red-500'}`} name="email" placeholder="Email address" autoComplete='off' value={`${email}`} onChange={(event) => setEmail(event.target.value)} onFocus={() => { 
                            setFocusInput({...templateFocusFalse, email: true}); 
                            !clickedInput.email && setClickedInput({...clickedInput, email: true})
                            }}/>
                        <span className={`${(email.length <= 0 && clickedInput.email === true && focusInput.email === false) ? 'block' : 'hidden'}`}>
                            <InvalidInputIcon />
                            <p className="absolute left-2 text-sm text-red-500 -bottom-5">
                                Cannot be empty
                            </p>
                        </span>       
                    </div>

                    {/* password */}
                    <div className=" relative mt-8">
                        <input type="password" className={`ring-gray-300 ring-1 rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent ${(password.length <= 0 && clickedInput.password === true && focusInput.password === false) && 'border-red-500'}`} name="password" autoComplete='off' placeholder="New password" value={`${password}`} onChange={(event) => setPassword(event.target.value)} onFocus={() => { 
                            setFocusInput({...templateFocusFalse, password: true}); 
                            !clickedInput.password && setClickedInput({...clickedInput, password: true})
                            }}/>
                        <span className={`${(password.length <= 0 && clickedInput.password === true && focusInput.password === false) ? 'block' : 'hidden'}`}>
                            <InvalidInputIcon />
                            <p className="absolute left-2 text-sm text-red-500 -bottom-5">
                                Cannot be empty
                            </p>
                        </span>       
                    </div>

                    {/* date of birth */}
                    <div className=" relative mt-8">
                        <input type="date" className={`ring-gray-300 ring-1 rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent ${(email.length <= 0 && clickedInput.birthDate === true && focusInput.birthDate === false) && 'border-red-500'}`} name="birthDate" autoComplete='off' placeholder="Date of Birth" value={`${birthDate}`} onChange={(event) => setBirthDate(event.target.value)} onFocus={() => { 
                            setFocusInput({...templateFocusFalse, birthDate: true}); 
                            !clickedInput.birthDate && setClickedInput({...clickedInput, birthDate: true})
                            }}/>
                        <span className={`${(birthDate.length <= 0 && clickedInput.birthDate === true && focusInput.birthDate === false) ? 'block' : 'hidden'}`}>
                            <InvalidInputIcon />
                            <p className="absolute left-2 text-sm text-red-500 -bottom-5">
                                Cannot be empty
                            </p>
                        </span>       
                    </div>

                    {/* gender */}
                    <div className=" relative mt-8 px-4">
                    <label className="inline-flex items-center">
                        <input type="radio" name="gender" value='male' className="h-5 w-5 text-red-600" onClick={()=>setGender('male')}/>
                        <span className="ml-2 text-gray-700">
                            Male
                        </span>
                    </label>

                    <label className="inline-flex items-center ml-5">
                        <input type="radio" name="gender" value='female' className="h-5 w-5 text-red-600" onClick={()=>setGender('female')}/>
                        <span className="ml-2 text-gray-700">
                            Female
                        </span>
                    </label>
                        <span className={`${(gender.length <= 0 && clickedInput.gender === true && focusInput.gender === false) ? 'block' : 'hidden'}`}>
                            <InvalidInputIcon />
                            <p className="absolute left-2 text-sm text-red-500 -bottom-5">
                                Cannot be empty
                            </p>
                        </span>       
                    </div>

                    <p className=' break-words max-w-md text-xs mt-7 text-gray-600'>By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may receive SMS notifications from us and can opt out at any time </p>

                    <button type="submit" className="py-1 px-16 max-w-fit bg-green-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-indigo-200 text-white text-lg mx-auto font-bold transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-9" >
                        Sign Up
                    </button>

                </form>
            </Modal>


        </main>
    )
}


export const InvalidInputIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className={`absolute text-red-500 right-2 bottom-3`} viewBox="0 0 1792 1792">
            <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
            </path>
        </svg>
    )
}
