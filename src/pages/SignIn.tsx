import React, { useState, lazy, Suspense } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const ModalSignUp = lazy(() => import("../components/signIn/ModalSignUp"));

export const SignIn = () => {
  const auth = getAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ModalSignUp modalIsOpen={modalIsOpen} closeModal={closeModal} />
        </Suspense>
      </div>
    </main>
  );
};
