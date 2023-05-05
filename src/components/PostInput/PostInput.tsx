import {
  addDoc,
  collection,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { createRef, memo, RefObject, useContext, useState } from "react";
import Modal from "react-modal";
import { AuthContext } from "../../contexts/AuthContext";
import * as modalPostInputConstants from "../../constants/ModalPostInput";
import ModalAccessExceptFriends from "./ModalAccessExceptFriends";
import ModalAccessSpecificFriends from "./ModalAccessSpecificFriends";
import { UserContext } from "../../contexts/UserContext";
import ModalAccessOption from "./ModalAccessOption";
import { postType } from "../../constants/ModalPostInput";
import { userProfileType } from "../../constants/EntityType";

function PostInput() {
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
      width: "500px",
    },
  };

  const modalShowOption = modalPostInputConstants.modalShowOption;
  const accessTypeOption = modalPostInputConstants.accessTypeOption;

  const db = getFirestore();
  const authUser = useContext(AuthContext);
  const user = useContext(UserContext);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const [friendsProfile, setFriendsProfile] = useState<Array<userProfileType>>([]);
  const [indexFetchFriendsProfile, setIndexFetchFriendsProfile] = useState<number>(0);
  const [modalShowSpecific, setModalShowSpecific] = useState(modalShowOption.main);
  const [lastVisibleFriends, setLastVisibleFriends] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined | null
  >(null);
  const [isFirstFetchFriendsDone, setIsFirstFetchFriendsDone] = useState<Boolean>(false);

  const [modalScrollDivRef, setModalScrollDivRef] = useState<RefObject<HTMLInputElement>>(
    createRef()
  );

  const [accessFriendsState, setAccessFriendsState] = useState<Array<String>>([]);
  const [accessExceptionsState, setAccessExceptionsState] = useState<Array<String>>([]);

  const [textInput, setTextInput] = useState("");
  const [accessType, setAccessType] = useState(accessTypeOption.friends);
  const [accessAllowed, setAccessAllowed] = useState<Array<String>>(user?.friends!!);
  const [contentType, setContentType] = useState(postType.textOnly);
  const [content, setContent] = useState<Object | null>(null);
  const [feeling, setFeeling] = useState(null);
  const [location, setLocation] = useState(null);
  const [tag, setTag] = useState<Array<Object> | null>(null);

  const handlePost = async () => {
    try {
      //Debugging purpose -> it will be deleted later
      let debugAccessAllowed = accessAllowed;
      debugAccessAllowed.push(authUser?.uid!!);

      let createdDate = Timestamp.now();

      // Add data to search posts collection
      const docRef = await addDoc(collection(db, "searchPosts"), {
        accessType,
        accessAllowed: debugAccessAllowed,
        createdAt: createdDate,
      });

      const dataPost = {
        idPost: docRef.id,
        idUser: authUser!!.uid,
        textPost: textInput.length > 0 ? textInput : null,
        feeling: feeling ? feeling : null,
        location: location ? location : null,
        tagTotal: 0,
        shareTotal: 0,
        commentTotal: 0,
        createdAt: createdDate,
        contentType: contentType,
        contentAttachment: null,
        accessType: accessType,
        reactTotalLike: 0,
        reactTotalLove: 0,
        reactTotalCare: 0,
        reactTotalHaha: 0,
        reactTotalWow: 0,
        reactTotalSad: 0,
        reactTotalAngry: 0,
      };

      // Add data to posts collection
      await setDoc(doc(db, "posts", docRef.id), dataPost);
      setTextInput("");
    } catch (error) {
      alert(error);
      setTextInput("");
    }
  };

  // Fungsi untuk mengambil friend profile pertama kali
  const firstFetchFriendsProfile = async () => {
    if (user === null || user === undefined || isFirstFetchFriendsDone === false) {
      return;
    }

    if (user.friends.length === 0) {
      setLastVisibleFriends(undefined);
      setIsFirstFetchFriendsDone(true);
      return;
    }

    const maxFriends = Math.min(10, user.friends.length) + 1;
    const friendList = user.friends.slice(0, maxFriends);
    let newProfileFriends: Array<userProfileType> = await queryFriendsProfile(friendList, db);

    setIndexFetchFriendsProfile(maxFriends);
    setFriendsProfile(newProfileFriends);
    setIsFirstFetchFriendsDone(true);
  };

  // Fungsi untuk mengambil friend profile selanjutnya
  const nextFetchFriendsProfile = async () => {
    if (user === null || user === undefined) {
      return;
    }
    const totalFriends = user.friends.length;
    const maxFriendsFetch = Math.min(totalFriends, indexFetchFriendsProfile + 4) + 1;
    const friendList = user!.friends.slice(indexFetchFriendsProfile, maxFriendsFetch);

    let newProfileFriends: Array<userProfileType> = await queryFriendsProfile(friendList, db);
    setFriendsProfile((prevState) => [...prevState, ...newProfileFriends]);
    setIndexFetchFriendsProfile(maxFriendsFetch);
  };

  // Fungsi untuk mengambil data user profile di Firestore
  const queryFriendsProfile = async (friendList: String[], db: Firestore) => {
    let newProfileFriends: Array<userProfileType> = [];
    const queryTask = query(collection(db, "userProfile"), where("idUser", "in", friendList));
    const documentSnapshots = await getDocs(queryTask);
    documentSnapshots.docs.forEach((item) => {
      newProfileFriends.push({
        idUser: item.data().idUser,
        photoUrl: item.data().photoUrl,
        username: item.data().username,
      });
    });
    return newProfileFriends;
  };

  const scrollModal = () => {
    if (
      isFirstFetchFriendsDone &&
      modalScrollDivRef.current?.scrollHeight! - modalScrollDivRef.current?.scrollTop! ===
        modalScrollDivRef.current?.clientHeight
    ) {
      lastVisibleFriends !== undefined && nextFetchFriendsProfile();
    }
  };

  return (
    <div className="post-input mt-10 mb-7 w-600 rounded-md bg-white shadow shadow-gray-400">
      <div className="top ml-3 flex items-center py-3">
        <img
          src={process.env.PUBLIC_URL + "./profile.jpg"}
          alt="profile-post"
          className=" h-10 w-10 rounded-full"
        />
        <p
          className=" ml-3 mr-3 w-full cursor-pointer rounded-xl bg-gray-100 py-1 px-3 text-left text-lg text-gray-600"
          onClick={openModal}
        >
          What's on your mind, fariz?
        </p>
      </div>
      <div className="bottom flex justify-center py-2">
        <span className=" flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 20 20"
            fill="#f94144"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <p className="ml-1 font-semibold text-gray-600">Live video</p>
        </span>
        <span className=" ml-5 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 20 20"
            fill="#52b788"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="ml-1 font-semibold text-gray-600">Photo/video</p>
        </span>
        <span className=" ml-5 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 20 20"
            fill="#f8961e"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
              clipRule="evenodd"
            />
          </svg>
          <p className="ml-1 font-semibold text-gray-600">Feeling/activity</p>
        </span>
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
          className={`${modalShowSpecific !== modalShowOption.main && ""}`}
        >
          {(() => {
            switch (modalShowSpecific) {
              case modalShowOption.main:
                return (
                  <div className=" flex flex-col">
                    <div className="mb-5 flex w-full items-center justify-between">
                      <p></p>
                      <p className=" text-xl font-bold">Create Post</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-9 cursor-pointer rounded-full p-1 hover:bg-slate-300"
                        viewBox="0 0 20 20"
                        fill="gray"
                        onClick={closeModal}
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={process.env.PUBLIC_URL + "./profile.jpg"}
                        alt="profile"
                        className="h-10 w-10 cursor-pointer rounded-full"
                      />
                      <span className="ml-3">
                        <p className=" font-semibold">{authUser?.displayName}</p>
                        <span
                          className="flex cursor-pointer items-center rounded bg-slate-200 p-1"
                          onClick={() => setModalShowSpecific(modalShowOption.access)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className=" text-xs font-semibold">{accessType}</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml1 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </div>

                    <textarea
                      name="status"
                      id=""
                      cols={1}
                      rows={5}
                      placeholder="what's on your mind, baiquni"
                      className=" mt-5 resize-none border-none p-2 text-2xl shadow-none outline-none"
                      onChange={(e) => setTextInput(e.target.value)}
                    ></textarea>

                    <div className=" flex items-center justify-between rounded-md border-2 border-gray-300 px-3 py-4">
                      <p className=" font-semibold">Add to your post</p>
                      <span className=" flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-1 h-7 w-7 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="#52b788"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-1 h-7 w-7 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="#023e8a"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-1 h-7 w-7 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="#ffb703"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-1 h-7 w-7 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="#e56b6f"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-1 h-7 w-7 cursor-pointer"
                          viewBox="0 0 20 20"
                          fill="#c9184a"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 cursor-pointer p-1"
                          viewBox="0 0 20 20"
                          fill="gray  "
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={textInput.length < 0 && true}
                      className={` mt-5 rounded-md py-2 font-semibold ${
                        textInput.length <= 0
                          ? "bg-slate-200 text-gray-500"
                          : " bg-blue-600 text-white"
                      }`}
                      onClick={() => {
                        handlePost();
                        closeModal();
                      }}
                    >
                      Post
                    </button>
                  </div>
                );

              case modalShowOption.access:
                return (
                  <ModalAccessOption
                    setModalShowSpecific={(data: string) => setModalShowSpecific(data)}
                    setAccessType={(data: string) => setAccessType(data)}
                    accessType={accessType}
                    idFriends={user?.friends !== undefined ? user.friends!! : ([] as String[])}
                    setAccessAllowed={(data: Array<String>) => setAccessAllowed(data)}
                  />
                );

              case modalShowOption.except:
                isFirstFetchFriendsDone === false && firstFetchFriendsProfile();
                return (
                  <div className="" ref={modalScrollDivRef} onScroll={scrollModal}>
                    <ModalAccessExceptFriends
                      friendsProfile={friendsProfile}
                      setAccessAllowed={(data: Array<String>) => setAccessAllowed(data)}
                      setModalShowSpecific={(data: string) => setModalShowSpecific(data)}
                      accessExceptionsState={accessExceptionsState}
                      setAccessExceptionsState={(data: Array<String>) =>
                        setAccessExceptionsState(data)
                      }
                      setAccessType={(data: string) => setAccessType(data)}
                      idFriends={user?.friends !== undefined ? user?.friends!! : []}
                    />
                  </div>
                );

              case modalShowOption.specific:
                isFirstFetchFriendsDone === false && firstFetchFriendsProfile();
                return (
                  <div className="" ref={modalScrollDivRef} onScroll={scrollModal}>
                    <ModalAccessSpecificFriends
                      friendsProfile={friendsProfile}
                      setAccessAllowed={(data: Array<String>) => setAccessAllowed(data)}
                      setModalShowSpecific={(data: string) => setModalShowSpecific(data)}
                      accessFriendsState={accessFriendsState}
                      setAccessFriendsState={(data: Array<String>) => setAccessFriendsState(data)}
                      setAccessType={(data: string) => setAccessType(data)}
                    />
                  </div>
                );

              default:
                return null;
            }
          })()}
        </form>
      </Modal>
    </div>
  ); // End Return
}

export default memo(PostInput);
