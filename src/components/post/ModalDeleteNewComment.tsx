import { Fragment } from "react";

type propsType = {
    onChageShowDeleteModal: (value: boolean) => void,
    onChageShowOptionComment: (value: boolean) => void,
    idCommentTemp: string,
    idCommentReal: string,
    deleteNewComment: (idReal: string, idTemp: string) => void
}

export default function ModalDeleteNewComment(props: propsType) {
  return (
        <Fragment>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-[600px] my-6 mx-auto max-w-3xl">
                    <div className=" flex flex-col border-0 rounded-lg shadow-lg relative w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-xl font-bold"> Delete Comment? </h3>
                            <span className=' rounded-full p-2 bg-slate-100 hover:bg-slate-200 cursor-pointer' onClick={() => props.onChageShowDeleteModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                        </div>
                        {/*body*/}
                        <div className="relative px-5 pt-2">
                            <p className=" text-left"> Are you sure you want to delete this comment? </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end px-5 rounded-b pb-4 pt-7 text-base">
                            <button
                                className="text-blue-500 font-bold px-3 py-2 mr-3 rounded-md text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => props.onChageShowDeleteModal(false)}
                            >
                                No
                            </button>
                            <button
                                className="bg-blue-500 text-white active:bg-blue-500 font-bold text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => { 
                                    props.onChageShowOptionComment(false); 
                                    props.onChageShowDeleteModal(false); 
                                    props.deleteNewComment(props.idCommentReal, props.idCommentTemp) 
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </Fragment>
  )
}