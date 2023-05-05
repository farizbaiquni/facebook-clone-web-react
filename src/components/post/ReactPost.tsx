import { async } from "@firebase/util";
import React, { useContext, useEffect, useState } from "react";
import { reactTypeOption } from "../../constants/EntityType";
import { UserContext } from "../../contexts/UserContext";

type propsType = {
  totalReact: number;
  reactTotalLike: number;
  reactTotalLove: number;
  reactTotalCare: number;
  reactTotalHaha: number;
  reactTotalWow: number;
  reactTotalSad: number;
  reactTotalAngry: number;
};

export default function ReactPost(props: propsType) {
  console.log("====== RE-RENDER REACT POST ======");
  const user = useContext(UserContext);
  const [displayedReactIcons, setDisplayedReactIcons] = useState<Set<string> | null>(null);

  const checkReactOnlyMe = () => {
    // if (props.totalReact === 1 && props.reactStatus !== null) {
    //   return true;
    // } else {
    //   return false;
    // }
  };
  const checkIsTotalReactIncludedMe = () => {
    // if (props.reactStatus) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  // const [reactOnlyMe, setReactOnlyMe] = useState<boolean>(checkReactOnlyMe());
  // const [isTotalReactIncludedMe, setIsTotalReactIncludedMe] = useState<Boolean>(
  //   checkIsTotalReactIncludedMe()
  // );

  const determineDisplayedReactIcons = () => {
    try {
      let tempResult: Set<string> = new Set();
      let result1: null | string = null;
      let result2: null | string = null;
      let index: number = 0;
      let tempMax: number = 0;

      const keys = [
        reactTypeOption.like,
        reactTypeOption.love,
        reactTypeOption.care,
        reactTypeOption.haha,
        reactTypeOption.wow,
        reactTypeOption.sad,
        reactTypeOption.angry,
      ];

      let arr = [
        props.reactTotalLike,
        props.reactTotalLove,
        props.reactTotalCare,
        props.reactTotalHaha,
        props.reactTotalWow,
        props.reactTotalSad,
        props.reactTotalAngry,
      ];

      // #1
      tempMax = Math.max(...arr);
      if (tempMax > 0) {
        index = arr.indexOf(tempMax);
        result1 = keys[index];

        //Splice
        keys.splice(index, 1);
        arr.splice(index, 1);

        //#2
        tempMax = Math.max(...arr);
        if (tempMax > 0) {
          index = arr.indexOf(tempMax);
          result2 = keys[index];
        }
      }

      if (result1 != null) {
        tempResult.add(result1);
      }

      if (result2 != null) {
        tempResult.add(result2);
      }

      setDisplayedReactIcons(tempResult);
    } catch (error) {
      setDisplayedReactIcons(null);
    }
  }; // End function

  const LikeIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="#00b4d8"
      >
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
    );
  };

  const LoveIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="#ff4d6d"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const CareIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="#ffbe0b"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  useEffect(() => {
    determineDisplayedReactIcons();
  }, []);

  return (
    <div className=" my-3 flex items-center">
      <p></p>
      {/* {(() => {
        if (props.totalReact <= 0) {
          if (props.reactStatus !== null) {
            switch (props.reactStatus) {
              case reactTypeOption.like:
                return <LikeIcon />;

              case reactTypeOption.love:
                return <LoveIcon />;

              case reactTypeOption.care:
                return <CareIcon />;
            }
          }
        } else {
          if (displayedReactIcons !== null) {
            if (reactOnlyMe === true) {
              if (props.reactStatus !== null) {
                return Array.from(displayedReactIcons).map((key) => {
                  switch (key) {
                    case reactTypeOption.like:
                      return (
                        <span key={key}>
                          <LikeIcon />
                        </span>
                      );

                    case reactTypeOption.love:
                      return (
                        <span key={key}>
                          <LoveIcon />
                        </span>
                      );

                    case reactTypeOption.care:
                      return (
                        <span key={key}>
                          <CareIcon />
                        </span>
                      );
                  }
                });
              }
            } else {
              return Array.from(displayedReactIcons).map((key) => {
                switch (key) {
                  case reactTypeOption.like:
                    return (
                      <span key={key}>
                        <LikeIcon />
                      </span>
                    );

                  case reactTypeOption.love:
                    return (
                      <span key={key}>
                        <LoveIcon />
                      </span>
                    );

                  case reactTypeOption.care:
                    return (
                      <span key={key}>
                        <CareIcon />
                      </span>
                    );
                }
              });
            }
          }
        }
      })()}
      &nbsp;
      {(() => {
        if (props.totalReact <= 0) {
          if (props.reactStatus !== null) {
            return <p className=" text-gray-500">{user?.firstName + " " + user?.lastName}</p>;
          }
        } else {
          if (reactOnlyMe === true) {
            if (props.reactStatus !== null) {
              return <p className=" text-gray-500">{user?.firstName + " " + user?.lastName}</p>;
            }
          } else {
            return (
              <p>
                <span className={`text-gray-500 ${props.reactStatus === null && "hidden"}`}>
                  You and{" "}
                </span>
                <span className=" text-gray-500">
                  {isTotalReactIncludedMe ? props.totalReact - 1 : props.totalReact}
                </span>
                <span className={`text-gray-500 ${props.reactStatus === null && "hidden"}`}>
                  {" "}
                  others
                </span>
              </p>
            );
          }
        }
      })()} */}
    </div>
  );
}
