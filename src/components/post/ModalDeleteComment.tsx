import { Fragment } from "react";

type propsType = {
  onChageShowDeleteModal: (value: boolean) => void;
  handleDeleteComment: () => void;
};

export default function ModalDeleteComment(props: propsType) {
  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-[600px] max-w-3xl">
          <div className=" relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between rounded-t border-b border-solid border-slate-200 px-5 py-4">
              <h3 className="text-xl font-bold"> Delete Comment? </h3>
              <span
                className=" cursor-pointer rounded-full bg-slate-100 p-2 hover:bg-slate-200"
                onClick={() => props.onChageShowDeleteModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
            {/*body*/}
            <div className="relative px-5 pt-2">
              <p className=" text-left"> Are you sure you want to delete this comment? </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b px-5 pb-4 pt-7 text-base">
              <button
                className="mr-3 rounded-md px-3 py-2 text-sm font-bold text-blue-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => props.onChageShowDeleteModal(false)}
              >
                No
              </button>
              <button
                className="rounded bg-blue-500 px-3 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-500"
                type="button"
                onClick={() => {
                  props.onChageShowDeleteModal(false);
                  props.handleDeleteComment();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </Fragment>
  );
}
