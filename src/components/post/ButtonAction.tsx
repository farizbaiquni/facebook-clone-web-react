import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { reactTypeOption } from "../../constants/EntityType";

type propsType = {
  userId: string;
  loadingProcessReact: boolean;
};

export default function ButtonAction(props: propsType) {
  return (
    <div className="flex justify-center border-y-2 border-gray-300 py-3">
      <span
        className="flex h-full w-full cursor-pointer justify-center hover:bg-slate-500"
        // onClick={
        //   props.reactStatus === reactTypeOption.like
        //     ? () => props.handleRemoveLike()
        //     : () => props.handleAddLike()
        // }
      >
        {props.loadingProcessReact ? (
          <img src={process.env.PUBLIC_URL + "./loading_blue.gif"} alt="" className="h-6 w-6" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-6 w-6"
            // fill={`${props.reactStatus === reactTypeOption.like ? `#1778F2` : "white"}`}
            viewBox="0 0 24 24"
            // stroke={`${props.reactStatus === reactTypeOption.like ? `white` : "gray"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
        )}

        <p className="font-semibold text-gray-500">Like</p>
      </span>

      <span className="flex w-full cursor-pointer justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="gray"
        >
          <path
            fillRule="evenodd"
            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        <p className="font-semibold text-gray-500">Comment</p>
      </span>

      <span className="flex w-full cursor-pointer justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="gray"
        >
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        <p className="font-semibold text-gray-500">Share</p>
      </span>
    </div>
  );
}
