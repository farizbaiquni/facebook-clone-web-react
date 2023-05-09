import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { createRef, Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import { commentDisplayType, userProfileType } from "../../constants/EntityType";
import { db } from "../../lib/firebase";
import ModalDeleteComment from "./ModalDeleteComment";
import CommentPhotoProfile from "./CommentPhotoProfile";
import { OwnCommentOptionMenu } from "./CommentOptionMenu";

type propsType = {
  comment: commentDisplayType;
};

function Comment(props: propsType) {
  const [userProfile, setUserProfile] = useState<userProfileType | null>(null);
  const [editText, setEditText] = useState<string>(props.comment.text);
  const [isTextEdited, setIsTextEdited] = useState(false);
  const [hideComment, setHideComment] = useState(false);

  const [editCommentMode, setEditCommentMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOptionComment, setShowOptionComment] = useState(false);

  const [queryLoading, setQueryLoading] = useState(false);
  const [errorEdit, setErrorEdit] = useState(false);
  const [errorDelete, setErrorDelete] = useState(false);

  const ref: React.RefObject<HTMLDivElement> = createRef();

  const commentRef = doc(db, "comments", props.comment.idPost, "comment", props.comment.id);

  const fetchUserProfile = useCallback(async () => {
    const docRef = doc(db, "userProfile", props.comment.idUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tempUserProfile: userProfileType = {
        idUser: docSnap.data().idUser,
        photoUrl: docSnap.data().photoUrl,
        username: docSnap.data().username,
      };
      setUserProfile(tempUserProfile);
    } else {
      console.log("No such document!");
    }
  }, [props.comment.idUser]);

  let onChageShowDeleteModal = useCallback((value: boolean) => {
    setShowDeleteModal(value);
  }, []);

  const isContinueProcessEdit = (): boolean => {
    return editText.length > 0 && editText !== props.comment.text;
  };

  const handleStateWhenErrorEdit = () => {
    setErrorEdit(true);
    setQueryLoading(false);
  };

  const handleEditComment = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      setShowOptionComment(false);
      if (event.code === "Enter") {
        if (isContinueProcessEdit()) {
          setQueryLoading(true);
          setIsTextEdited(true);
          setEditCommentMode(false);
          const queryEditTimer = setTimeout(() => {
            handleStateWhenErrorEdit();
          }, 4300);
          await updateDoc(commentRef, { text: editText })
            .then(() => {
              clearTimeout(queryEditTimer);
              setErrorEdit(false);
              setQueryLoading(false);
            })
            .catch((error) => {
              handleStateWhenErrorEdit();
            });
        }
      } else {
        setShowDeleteModal(true);
      }
    } catch (error) {}
  };

  const handleStateWhenErrorDelete = () => {
    setHideComment(false);
    setErrorDelete(true);
    setQueryLoading(false);
  };

  const handleDeleteComment = async () => {
    try {
      setShowOptionComment(false);
      setHideComment(true);
      setQueryLoading(true);
      const queryDeleteTimer = setTimeout(() => {
        handleStateWhenErrorDelete();
      }, 4300);
      await deleteDoc(commentRef)
        .then(() => {
          clearTimeout(queryDeleteTimer);
          setHideComment(true);
          setErrorDelete(false);
          setQueryLoading(false);
        })
        .catch((error) => {
          handleStateWhenErrorDelete();
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && ref.current) {
        const cur = ref.current;
        if (cur && !cur.contains(event.target as Node)) {
          setShowOptionComment(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  return (
    <Fragment>
      {userProfile !== null && hideComment === false && (
        <div className="group mt-3 flex">
          <CommentPhotoProfile isQueryError={errorEdit} />
          {!editCommentMode ? (
            <span className=" flex flex-col">
              <div className="flex items-center">
                <span
                  className={`flex flex-col rounded-2xl border-[1px] bg-gray-100 px-3 py-2 ${
                    (errorEdit || errorDelete) && "border-red-500"
                  } `}
                >
                  <p className=" text-left text-sm font-semibold">{userProfile.username}</p>
                  <p className=" text-left">{isTextEdited ? editText : props.comment.text}</p>
                </span>

                {(!queryLoading || !props.comment.isPending) && (
                  <div className={`${!errorEdit && !errorDelete ? "relative" : "hidden"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setShowOptionComment((prevState) => !prevState)}
                      className={`ml-3 block h-4 w-4 cursor-pointer group-hover:block`}
                      viewBox="0 0 20 20"
                      fill="gray"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <div
                      className={`${
                        showOptionComment ? "absolute" : "hidden"
                      } w-72 rounded-md bg-white p-2 text-left shadow-md shadow-slate-400`}
                      ref={ref}
                    >
                      <OwnCommentOptionMenu
                        setEditCommentMode={setEditCommentMode}
                        setShowDeleteModal={setShowDeleteModal}
                      />
                    </div>
                  </div>
                )}
              </div>

              <span className="mt-1 flex px-3">
                {errorEdit ||
                  (errorDelete ? (
                    <Fragment>
                      <p className=" mr-1 text-xs text-gray-500 hover:underline">Unable to </p>
                      {errorEdit && <p className=" mr-1 text-xs text-gray-500">edit comment. </p>}
                      {errorDelete && (
                        <p className=" mr-1 text-xs text-gray-500">delete comment. </p>
                      )}
                      <p className=" cursor-pointer text-xs text-blue-600 hover:underline">
                        Try again
                      </p>
                    </Fragment>
                  ) : queryLoading || props.comment.isPending ? (
                    <p className="text-left text-sm font-semibold text-gray-500">posting...</p>
                  ) : (
                    <Fragment>
                      <p className=" mr-4 cursor-pointer text-xs font-bold text-gray-500 hover:underline">
                        Like
                      </p>
                      <p className=" mr-4 cursor-pointer text-xs font-bold text-gray-500 hover:underline">
                        Reply
                      </p>
                      <p className=" cursor-pointer text-xs font-bold text-gray-500 hover:underline">
                        See translation
                      </p>
                    </Fragment>
                  ))}
              </span>
            </span>
          ) : (
            <div className=" flex flex-col items-start">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Write a comment..."
                className=" flex-1 rounded-lg bg-gray-100 px-3 focus:outline-none"
                onKeyDown={handleEditComment}
              />
              <p className=" pt-1 text-xs text-slate-500">
                Press Esc to &nbsp;
                <span
                  className=" cursor-pointer text-sm font-semibold text-blue-500"
                  onClick={() => {
                    setEditCommentMode(false);
                    setShowOptionComment(false);
                  }}
                >
                  cancel
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <ModalDeleteComment
          onChageShowDeleteModal={onChageShowDeleteModal}
          handleDeleteComment={handleDeleteComment}
        />
      )}
    </Fragment>
  );
}

export default memo(Comment);
