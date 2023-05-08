import { Fragment } from "react";

type PropsType = {
  setEditCommentMode: (data: boolean) => void;
  setShowDeleteModal: (data: boolean) => void;
};

export function OwnCommentOptionMenu(props: PropsType) {
  return (
    <Fragment>
      <p
        className=" cursor-pointer py-2 pl-2 text-sm font-semibold hover:bg-slate-300"
        onClick={() => props.setEditCommentMode(true)}
      >
        Edit
      </p>
      <p
        className=" cursor-pointer py-2 pl-2 text-sm font-semibold hover:bg-slate-300"
        onClick={() => props.setShowDeleteModal(true)}
      >
        Delete
      </p>
    </Fragment>
  );
}
