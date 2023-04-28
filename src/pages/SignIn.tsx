import React, { useContext } from "react";
import Modal from "react-modal";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { doc, getFirestore, Timestamp, writeBatch } from "firebase/firestore";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(255, 255, 255, 0.8)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const SignIn = () => {
  useContext(FirebaseContext);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //updateUserProfile()
        })
        .catch((error) => {
          if ("uth/email-already-in-use") {
            alert("Email already in use");
          } else {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage + "Error Code : " + errorCode);
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  const updateUserProfile = async () => {
    await updateProfile(auth.currentUser!!, {
      displayName: firstName + " " + lastName,
    }).then(() => {
      addDataAfterCreateUser();
    });
  };

  const addDataAfterCreateUser = async () => {
    const userRef = doc(db, "users", getAuth().currentUser!.uid);
    const userProfileRef = doc(db, "usersProfile", getAuth().currentUser!.uid);

    const batch = writeBatch(db);
    batch.set(userRef, {
      userId: getAuth().currentUser?.uid,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      gender: gender,
      createAt: Timestamp.now(),
      friends: [],
    });

    batch.set(userProfileRef, {
      userId: getAuth().currentUser!.uid,
      photoUrl: "",
      name: firstName + " " + lastName,
    });

    await batch.commit();
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        alert("login success");
      })
      .catch((error) => {
        alert(
          "Login error, error code = " +
            error.code +
            ", pesan error = " +
            error.message
        );
      });
  };

  //Form input
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [gender, setGender] = React.useState("");

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [clickedInput, setClickedInput] = React.useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    birthDate: false,
    gender: false,
  });

  const [focusInput, setFocusInput] = React.useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    birthDate: false,
    gender: false,
  });

  const templateFocusFalse = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    birthDate: false,
    gender: false,
  };

  return (
    <main className="flex h-100vh flex-col items-center justify-center min-lg:flex-row">
      <div className="left_side w-400 lg:w-600">
        <img
          src={process.env.PUBLIC_URL + "./facebook_text.svg"}
          alt="facebook"
          className=" w-80 max-lg:mx-auto"
        />
        <h1 className="text-left text-3xl min-lg:ml-8 min-lg:tracking-wide max-lg:text-justify max-lg:text-2xl">
          Facebook helps you connect and share with the people in your life.
        </h1>
      </div>

      <div className="right_side">
        <form
          action=""
          className="w-400 rounded-md border-2 border-slate-300 px-5 pt-14 pb-8 shadow-lg shadow-gray-300"
          onSubmit={(e) => handleLogin(e)}
        >
          <input
            typeof="email"
            id="inputEmail"
            className="w-full flex-1 appearance-none rounded-md border border-transparent border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
            name="email"
            placeholder="Email address or phone number"
            onChange={(event) => setLoginEmail(event.target.value)}
          />

          <input
            typeof="password"
            type="password"
            id="inputPassword"
            className="mt-3 w-full flex-1 appearance-none rounded-md border border-transparent border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
            name="password"
            placeholder="Password"
            onChange={(event) => setLoginPassword(event.target.value)}
          />

          <button
            type="submit"
            className="focus:0 mt-5 w-full rounded-lg bg-blue-600 py-3 px-4 text-center text-lg font-bold text-white shadow-md ring-2 transition duration-200 ease-in hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
          >
            Log In
          </button>

          <p className=" mt-3 cursor-pointer text-sm text-blue-600">
            Forgotten password ?
          </p>

          <button
            type="button"
            className="text-md mt-9 rounded-lg bg-green-500 py-3 px-4 text-center font-bold text-white shadow-md transition duration-200 ease-in hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
            onClick={openModal}
          >
            Create New Account
          </button>
        </form>
        <p className="mt-5 text-sm">
          <span className=" cursor-pointer font-semibold">Create a Page</span>{" "}
          for a celebrity, brand or business.
        </p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Sign Up"
        ariaHideApp={false}
      >
        <form
          action="form-sign-up"
          className="flex flex-col"
          onSubmit={(e) => {
            if (
              firstName.length <= 0 ||
              lastName.length <= 0 ||
              email.length <= 0 ||
              password.length <= 0 ||
              birthDate.length <= 0 ||
              gender.length <= 0
            ) {
              setClickedInput({
                ...clickedInput,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
                birthDate: true,
                gender: true,
              });
            } else {
              handleSignUp(e);
            }
          }}
        >
          <h1 className="text-3xl font-semibold">Sign Up</h1>
          <h2 className=" mt-1 text-sm text-gray-500">It's quick and easy.</h2>

          <hr className="my-5 bg-slate-300" />

          <div className="flex">
            {/* first name */}
            <div className=" relative ">
              <input
                type="text"
                className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                  firstName.length <= 0 &&
                  clickedInput.firstName === true &&
                  focusInput.firstName === false &&
                  "border-red-500"
                }`}
                autoComplete="off"
                name="email"
                placeholder="First name"
                value={`${firstName}`}
                onChange={(event) => setFirstName(event.target.value)}
                onFocus={() => {
                  setFocusInput({ ...templateFocusFalse, firstName: true });
                  !clickedInput.firstName &&
                    setClickedInput({ ...clickedInput, firstName: true });
                }}
              />
              <span
                className={`${
                  firstName.length <= 0 &&
                  clickedInput.firstName === true &&
                  focusInput.firstName === false
                    ? "block"
                    : "hidden"
                }`}
              >
                <InvalidInputIcon />
                <p className="absolute left-2 -bottom-5 text-sm text-red-500">
                  What's your name?
                </p>
              </span>
            </div>

            {/* surname */}
            <div className=" relative ml-2 ">
              <input
                type="text"
                className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                  lastName.length <= 0 &&
                  clickedInput.lastName === true &&
                  focusInput.lastName === false &&
                  "border-red-500"
                }`}
                autoComplete="off"
                name="email"
                placeholder="Surname"
                value={`${lastName}`}
                onChange={(event) => setLastName(event.target.value)}
                onFocus={() => {
                  setFocusInput({ ...templateFocusFalse, lastName: true });
                  !clickedInput.lastName &&
                    setClickedInput({ ...clickedInput, lastName: true });
                }}
              />
              <span
                className={`${
                  lastName.length <= 0 &&
                  clickedInput.lastName === true &&
                  focusInput.lastName === false
                    ? "block"
                    : "hidden"
                }`}
              >
                <InvalidInputIcon />
                <p className="absolute left-2 -bottom-5 text-sm text-red-500">
                  What's your name?
                </p>
              </span>
            </div>
          </div>

          {/* email */}
          <div className=" relative mt-8">
            <input
              type="text"
              className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                email.length <= 0 &&
                clickedInput.email === true &&
                focusInput.email === false &&
                "border-red-500"
              }`}
              name="email"
              placeholder="Email address"
              autoComplete="off"
              value={`${email}`}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => {
                setFocusInput({ ...templateFocusFalse, email: true });
                !clickedInput.email &&
                  setClickedInput({ ...clickedInput, email: true });
              }}
            />
            <span
              className={`${
                email.length <= 0 &&
                clickedInput.email === true &&
                focusInput.email === false
                  ? "block"
                  : "hidden"
              }`}
            >
              <InvalidInputIcon />
              <p className="absolute left-2 -bottom-5 text-sm text-red-500">
                Cannot be empty
              </p>
            </span>
          </div>

          {/* password */}
          <div className=" relative mt-8">
            <input
              type="password"
              className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                password.length <= 0 &&
                clickedInput.password === true &&
                focusInput.password === false &&
                "border-red-500"
              }`}
              name="password"
              autoComplete="off"
              placeholder="New password"
              value={`${password}`}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => {
                setFocusInput({ ...templateFocusFalse, password: true });
                !clickedInput.password &&
                  setClickedInput({ ...clickedInput, password: true });
              }}
            />
            <span
              className={`${
                password.length <= 0 &&
                clickedInput.password === true &&
                focusInput.password === false
                  ? "block"
                  : "hidden"
              }`}
            >
              <InvalidInputIcon />
              <p className="absolute left-2 -bottom-5 text-sm text-red-500">
                Cannot be empty
              </p>
            </span>
          </div>

          {/* date of birth */}
          <div className=" relative mt-8">
            <input
              type="date"
              className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                email.length <= 0 &&
                clickedInput.birthDate === true &&
                focusInput.birthDate === false &&
                "border-red-500"
              }`}
              name="birthDate"
              autoComplete="off"
              placeholder="Date of Birth"
              value={`${birthDate}`}
              onChange={(event) => setBirthDate(event.target.value)}
              onFocus={() => {
                setFocusInput({ ...templateFocusFalse, birthDate: true });
                !clickedInput.birthDate &&
                  setClickedInput({ ...clickedInput, birthDate: true });
              }}
            />
            <span
              className={`${
                birthDate.length <= 0 &&
                clickedInput.birthDate === true &&
                focusInput.birthDate === false
                  ? "block"
                  : "hidden"
              }`}
            >
              <InvalidInputIcon />
              <p className="absolute left-2 -bottom-5 text-sm text-red-500">
                Cannot be empty
              </p>
            </span>
          </div>

          {/* gender */}
          <div className=" relative mt-8 px-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                className="h-5 w-5 text-red-600"
                onClick={() => setGender("male")}
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>

            <label className="ml-5 inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                className="h-5 w-5 text-red-600"
                onClick={() => setGender("female")}
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
            <span
              className={`${
                gender.length <= 0 &&
                clickedInput.gender === true &&
                focusInput.gender === false
                  ? "block"
                  : "hidden"
              }`}
            >
              <InvalidInputIcon />
              <p className="absolute left-2 -bottom-5 text-sm text-red-500">
                Cannot be empty
              </p>
            </span>
          </div>

          <p className=" mt-7 max-w-md break-words text-xs text-gray-600">
            By clicking Sign Up, you agree to our Terms, Data Policy and Cookie
            Policy. You may receive SMS notifications from us and can opt out at
            any time{" "}
          </p>

          <button
            type="submit"
            className="mx-auto mt-9 max-w-fit rounded-lg bg-green-600 py-1 px-16 text-center text-lg font-bold text-white shadow-md transition duration-200 ease-in hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
          >
            Sign Up
          </button>
        </form>
      </Modal>
    </main>
  );
};

export const InvalidInputIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="currentColor"
      className={`absolute right-2 bottom-3 text-red-500`}
      viewBox="0 0 1792 1792"
    >
      <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z"></path>
    </svg>
  );
};
