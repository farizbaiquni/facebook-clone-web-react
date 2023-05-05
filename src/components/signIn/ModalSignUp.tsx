import React, { useState } from "react";
import Modal from "react-modal";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getFirestore, Timestamp, writeBatch } from "firebase/firestore";
import {
  InputSignUpEnum,
  InvalidInputSignUpType,
  initInvalidInputSignUp,
} from "../../constants/InvalidInput";
import { InvalidInputIcon } from "../../commonComponents/icons/InvalidInputIcon";

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

type PropsType = {
  modalIsOpen: boolean;
  closeModal: () => void;
};

function ModalSignUp(props: PropsType) {
  const auth = getAuth();
  const db = getFirestore();

  //Form input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [triggerHelper, setTriggerHelper] = useState(false);

  const [invalidInputSignUp, setInvalidInputSignUp] =
    useState<InvalidInputSignUpType>(initInvalidInputSignUp);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmitValidateInput()) {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            updateUserProfile();
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

    await batch.commit().then(() => {
      alert("Create Account success , please login");
      props.closeModal();
    });
  };

  const onSubmitValidateInput = () => {
    setTriggerHelper((prevState) => !prevState);
    let isValid = true;
    let _invalidInputSignUp: InvalidInputSignUpType = initInvalidInputSignUp;
    if (firstName.length < 1) {
      _invalidInputSignUp.firstName = true;
      isValid = false;
    }
    if (lastName.length < 1) {
      _invalidInputSignUp.lastName = true;
      isValid = false;
    }
    if (email.length < 1) {
      _invalidInputSignUp.email = true;
      isValid = false;
    }
    if (password.length < 1) {
      _invalidInputSignUp.password = true;
      isValid = false;
    }
    if (birthDate.length < 1) {
      _invalidInputSignUp.birthDate = true;
      isValid = false;
    }
    if (gender.length < 1) {
      _invalidInputSignUp.gender = true;
      isValid = false;
    }
    setInvalidInputSignUp(_invalidInputSignUp);
    return isValid;
  };

  const onChangeValidateAndSetInput = (value: string, inputType: InputSignUpEnum) => {
    switch (inputType) {
      case InputSignUpEnum.firstName:
        value.length > 0
          ? (invalidInputSignUp.firstName = false)
          : (invalidInputSignUp.firstName = true);
        setFirstName(value);
        break;
      case InputSignUpEnum.lastName:
        value.length > 0
          ? (invalidInputSignUp.lastName = false)
          : (invalidInputSignUp.lastName = true);
        setLastName(value);
        break;
      case InputSignUpEnum.email:
        value.length > 0 ? (invalidInputSignUp.email = false) : (invalidInputSignUp.email = true);
        setEmail(value);
        break;
      case InputSignUpEnum.password:
        value.length > 0
          ? (invalidInputSignUp.password = false)
          : (invalidInputSignUp.password = true);
        setPassword(value);
        break;
      case InputSignUpEnum.birthDate:
        value.length > 0
          ? (invalidInputSignUp.birthDate = false)
          : (invalidInputSignUp.birthDate = true);
        setBirthDate(value);
        break;
      case InputSignUpEnum.gender:
        value.length > 0 ? (invalidInputSignUp.gender = false) : (invalidInputSignUp.gender = true);
        setGender(value);
        break;
    }
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      style={customStyles}
      contentLabel="Sign Up"
      ariaHideApp={false}
    >
      <form
        action="form-sign-up"
        className="flex flex-col"
        onSubmit={(e) => {
          handleSignUp(e);
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
                invalidInputSignUp.firstName && "border-red-500"
              }`}
              autoComplete="off"
              name="email"
              placeholder="First name"
              value={`${firstName}`}
              onChange={(event) =>
                onChangeValidateAndSetInput(event.target.value, InputSignUpEnum.firstName)
              }
            />
            <span className={`${invalidInputSignUp.firstName ? "block" : "hidden"}`}>
              <InvalidInputIcon />
              <p className="absolute left-2 -bottom-5 text-sm text-red-500">What's your name?</p>
            </span>
          </div>

          {/* surname */}
          <div className=" relative ml-2 ">
            <input
              type="text"
              className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                invalidInputSignUp.lastName && "border-red-500"
              }`}
              autoComplete="off"
              name="email"
              placeholder="Surname"
              value={`${lastName}`}
              onChange={(event) =>
                onChangeValidateAndSetInput(event.target.value, InputSignUpEnum.lastName)
              }
            />
            <span className={`${invalidInputSignUp.lastName ? "block" : "hidden"}`}>
              <InvalidInputIcon />
              <p className="absolute left-2 -bottom-5 text-sm text-red-500">What's your name?</p>
            </span>
          </div>
        </div>

        {/* email */}
        <div className=" relative mt-8">
          <input
            type="text"
            className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
              invalidInputSignUp.email && "border-red-500"
            }`}
            name="email"
            placeholder="Email address"
            autoComplete="off"
            value={`${email}`}
            onChange={(event) =>
              onChangeValidateAndSetInput(event.target.value, InputSignUpEnum.email)
            }
          />
          <span className={`${invalidInputSignUp.email ? "block" : "hidden"}`}>
            <InvalidInputIcon />
            <p className="absolute left-2 -bottom-5 text-sm text-red-500">Cannot be empty</p>
          </span>
        </div>

        {/* password */}
        <div className=" relative mt-8">
          <input
            type="password"
            className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
              invalidInputSignUp.password && "border-red-500"
            }`}
            name="password"
            autoComplete="off"
            placeholder="New password"
            value={`${password}`}
            onChange={(event) =>
              onChangeValidateAndSetInput(event.target.value, InputSignUpEnum.password)
            }
          />
          <span className={`${invalidInputSignUp.password ? "block" : "hidden"}`}>
            <InvalidInputIcon />
            <p className="absolute left-2 -bottom-5 text-sm text-red-500">Cannot be empty</p>
          </span>
        </div>

        {/* date of birth */}
        <div className=" relative mt-8">
          <input
            type="date"
            className={`w-full flex-1 appearance-none rounded-sm border border-transparent border-gray-300 bg-white py-1 px-4 text-base text-gray-700 placeholder-gray-400 shadow-sm ring-1 ring-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 ${
              invalidInputSignUp.birthDate && "border-red-500"
            }`}
            name="birthDate"
            autoComplete="off"
            placeholder="Date of Birth"
            value={`${birthDate}`}
            onChange={(event) =>
              onChangeValidateAndSetInput(event.target.value, InputSignUpEnum.birthDate)
            }
          />
          <span className={`${invalidInputSignUp.birthDate ? "block" : "hidden"}`}>
            <InvalidInputIcon />
            <p className="absolute left-2 -bottom-5 text-sm text-red-500">Cannot be empty</p>
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
              onClick={() => onChangeValidateAndSetInput("male", InputSignUpEnum.gender)}
            />
            <span className="ml-2 text-gray-700">Male</span>
          </label>

          <label className="ml-5 inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="female"
              className="h-5 w-5 text-red-600"
              onClick={() => onChangeValidateAndSetInput("female", InputSignUpEnum.gender)}
            />
            <span className="ml-2 text-gray-700">Female</span>
          </label>
          <span className={`${invalidInputSignUp.gender ? "block" : "hidden"}`}>
            <InvalidInputIcon />
            <p className="absolute left-2 -bottom-5 text-sm text-red-500">Cannot be empty</p>
          </span>
        </div>

        <p className=" mt-7 max-w-md break-words text-xs text-gray-600">
          By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may
          receive SMS notifications from us and can opt out at any time{" "}
        </p>

        <button
          type="submit"
          className="mx-auto mt-9 max-w-fit rounded-lg bg-green-600 py-1 px-16 text-center text-lg font-bold text-white shadow-md transition duration-200 ease-in hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
        >
          Sign Up
        </button>
      </form>
    </Modal>
  );
}

export default ModalSignUp;
