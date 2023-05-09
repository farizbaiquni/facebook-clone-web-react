import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import { reactEnum, totalReactPostType, userReactPostType } from "../../constants/EntityType";
import ReactPostButtonAction from "./ReactPostButtonAction";
import ReactPostCount from "./ReactPostCount";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type propsType = {
  totalReactPost: totalReactPostType;
  idPost: string;
  idUser: string;
};

function ReactPost(props: propsType) {
  const [changingReactOnProgress, setChangingReactOnProgress] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetchUsersReactPostDone, setIsFetchUsersReactPostDone] = useState(false);
  const [usersReactPost, setUsersReactPost] = useState<
    userReactPostType["usersReactType"] | null | undefined
  >(null);
  const [currentReactStatus, setCurrentReactStatus] = useState<reactEnum | null | undefined>(null);

  const handleChangeReact = useCallback(
    async (value: reactEnum) => {
      try {
        setChangingReactOnProgress(true);
        const docRef = doc(db, "usersReactPost", props.idPost);
        if (currentReactStatus === value) {
          setCurrentReactStatus(undefined);
          await setDoc(
            docRef,
            {
              idPost: props.idPost,
              idUsers: arrayRemove(props.idUser),
              usersReactPost: {
                [props.idUser]: deleteField(),
              },
            },
            { merge: true }
          )
            .then(() => {
              setChangingReactOnProgress(false);
            })
            .catch(() => {
              setCurrentReactStatus(value);
              setChangingReactOnProgress(false);
            });
        } else {
          const prevValue = currentReactStatus;
          setCurrentReactStatus(value);
          await setDoc(
            docRef,
            {
              idPost: props.idPost,
              idUsers: arrayUnion(props.idUser),
              usersReactPost: { [props.idUser]: value },
            },
            { merge: true }
          )
            .then(() => {
              setChangingReactOnProgress(false);
            })
            .catch(() => {
              setCurrentReactStatus(prevValue);
              setChangingReactOnProgress(false);
            });
        }
      } catch (error) {}
    },
    [currentReactStatus, props.idPost, props.idUser]
  );

  const getCurrentReactStatus = (): reactEnum | undefined => {
    try {
      if (usersReactPost === undefined) {
        return undefined;
      }
      const react = usersReactPost!.get(props.idUser.toString());
      switch (react) {
        case 0:
          return reactEnum.LIKE;
        case 1:
          return reactEnum.LOVE;
        case 2:
          return reactEnum.CARE;
        case 3:
          return reactEnum.HAHA;
        case 4:
          return reactEnum.WOW;
        case 5:
          return reactEnum.SAD;
        case 6:
          return reactEnum.ANGRY;
        default:
          return undefined;
      }
    } catch (error) {
      setIsError(true);
    }
  };

  const handleCurrentReactStatus = () => {
    try {
      const react = getCurrentReactStatus();
      setCurrentReactStatus(react);
    } catch (error) {
      setIsError(true);
    }
  };

  const fetchUsersReactPost = async () => {
    try {
      setIsError(false);
      const queryTask = query(
        collection(db, "usersReactPost"),
        where("idPost", "==", props.idPost),
        where("idUsers", "array-contains", props.idUser),
        limit(1)
      );

      await getDocs(queryTask)
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
              const tempUsersReact: userReactPostType["usersReactType"] = doc.data().usersReactPost
                ? new Map(Object.entries(doc.data().usersReactPost as Object))
                : new Map();
              setUsersReactPost(tempUsersReact);
            });
          } else {
            setUsersReactPost(undefined);
          }
          setIsFetchUsersReactPostDone(true);
        })
        .catch(() => {
          setIsError(true);
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (usersReactPost !== null) {
      handleCurrentReactStatus();
    }
  }, [usersReactPost]);

  useEffect(() => {
    if (!isFetchUsersReactPostDone) {
      fetchUsersReactPost();
    }
  }, [isFetchUsersReactPostDone]);

  return (
    <div className="flex flex-col justify-between">
      {currentReactStatus === null ? (
        isError ? (
          <div>
            <p className="cursor-pointer font-semibold">
              something went wrong, <span className=" text-blue-600 underline">try-again</span>
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <img src={process.env.PUBLIC_URL + "./loading_blue.gif"} alt="" className="h-6 w-6" />
          </div>
        )
      ) : (
        <Fragment>
          <ReactPostCount
            currentReactStatus={currentReactStatus}
            totalReactPost={props.totalReactPost}
          />
          <ReactPostButtonAction
            changingReactOnProgress={changingReactOnProgress}
            currentReactStatus={currentReactStatus}
            handleChangeReact={handleChangeReact}
          />
        </Fragment>
      )}
    </div>
  );
}

export default memo(ReactPost);
