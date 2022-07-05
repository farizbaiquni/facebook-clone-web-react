import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { createRef, Fragment, useCallback, useEffect, useState } from 'react'
import { idNewCommentType, newCommentDisplayedType } from '../../constants/EntityType'
import { db } from '../../lib/firebase'
import ModalDeleteNewComment from './ModalDeleteNewComment'

type propsType = {
  comment: newCommentDisplayedType,
  username: string,
  photoUrl: string | undefined,
  idNewComments: idNewCommentType[]
  errorNewComments: string[]
}

export default function NewComment(props: propsType) {

    console.log("====== RE-RENDER NEW COMMENT "+ props.comment.text  +" ======")

    const [idCommentReal, setIdCommentReal] = useState<string | null>(null)
    const [editedText, setEditedText] = useState(false)
    const [editText, setEditText] = useState<string>(props.comment.text)
    const [editCommentMode, setEditComentMode] = useState(false)
    const [showOptionComment, setShowOptionComment] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [queryLoading, setQueryLoading] = useState(false)
    const [queryError, setQueryError] = useState(false)
    const [hiddenComment, setHiddenComment] = useState(false)
    const [errorDelete, setErrorDelete] = useState(false)
    const [createError, setCreateError] = useState<boolean>(false)
    const ref: React.RefObject<HTMLDivElement> = createRef();


    const checkIsSyncInDB = useCallback(() => {
        for (let i = 0; i < props.idNewComments.length; i++) {
            if(props.idNewComments[i].tempId === props.comment.idCommentTemp) {
                setIdCommentReal(props.idNewComments[i].realId)
                break
            }
        }
        // props.idNewComments.map(id => {
        //     if(id.tempId === props.comment.idCommentTemp) {
        //         setIdCommentReal(id.realId)
        //     }
        // })
    }, [props.comment.idCommentTemp, props.idNewComments])

    const checkIfError = () => {
        for (let i = 0; i < props.errorNewComments.length; i++) {
            if(props.errorNewComments[i] === props.comment.idCommentTemp) {
                setCreateError(true)
                break
            }
        }
    }


    let onChageShowDeleteModal = useCallback((value: boolean) => {
        setShowDeleteModal(value)
    }, [showDeleteModal])


    const onChageShowOptionComment = useCallback((value: boolean) => {
        setShowOptionComment(value)
    }, [showOptionComment])


    const handleEditNewComment = async(event: React.KeyboardEvent<HTMLInputElement>) => { 
        if(event.code === 'Enter') {
            if(editText.length > 0) {
                if(editText !== props.comment.text && idCommentReal != null) {
                    setQueryLoading(true)
                    setEditedText(true)
                    setShowDeleteModal(false)
                    setShowOptionComment(false)
                    setEditComentMode(false)
                    const queryTimer = setTimeout(() => { setQueryError(true); setQueryLoading(false) }, 4300)
                    await updateDoc(doc(db, 'comments', idCommentReal!), { "text": editText,})
                    .then(() => {
                    clearTimeout(queryTimer)
                    setQueryLoading(false)
                    setQueryError(false)
                    })
                    .catch((error) => {
                    setQueryError(true); 
                    })
                }
            } else {
                setShowDeleteModal(true)
            }
        }
    }

    const handleDeleteNewComment = async() => {
        try {
            setHiddenComment(true)
            setQueryLoading(true)
            setShowDeleteModal(false)
            setShowOptionComment(false)
            const queryTimer = setTimeout(() => {setQueryError(true); setQueryLoading(false); setHiddenComment(false); setErrorDelete(true)}, 4300)
            await deleteDoc(doc(db, "comments", idCommentReal!)).then(() => {
              clearTimeout(queryTimer)
              setHiddenComment(true)
              setQueryLoading(false)
              setQueryError(false)
              setErrorDelete(false)
            }).catch((error) => {
              setQueryError(true)
              setHiddenComment(false)
            })
        } catch (error) { }
      }
    
    useEffect(() => {
        showDeleteModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
     }, [showDeleteModal ]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref && ref !== null) {
            const cur = ref.current;
            if (cur && !cur.contains(event.target as Node)) {
                setShowOptionComment(false)
            }
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };

    }, [ref])


    useEffect(() => {
        if(props.idNewComments.length > 0 && idCommentReal == null) {
            checkIsSyncInDB()
        }
    }, [props.idNewComments])


    useEffect(() => {
        if(idCommentReal == null && props.errorNewComments.length > 0) {
            checkIfError()
        }
    }, [props.errorNewComments])


    return (
        <Fragment>
            {
                (hiddenComment === false) && (
                    <div className=' flex mt-3 group'>
                        <div>
                            <span className=' relative top-0 left-0 bg-blue-500'>
                                <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
                                {
                                    ((idCommentReal === null && createError === true) || queryError) && (
                                        <span className=' bg-white rounded-full absolute top-1/3 right-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="red" className=" w-4 h-4 m-1" viewBox="0 0 16 16"> 
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/> 
                                            </svg>
                                        </span>
                                    )
                                }
                            </span>
                        </div>
                        {
                            !editCommentMode ? (
                                <span className=' flex flex-col'>
                                    <div className="flex items-center">
                                        <span className=' flex flex-col bg-gray-100 px-3 py-2 rounded-lg'>
                                            <p className=' text-sm font-semibold text-left'>{props.username}</p>
                                            <p className=' text-left'>{editedText ? editText : props.comment.text}</p>
                                        </span>
                                        
                                        {
                                            (queryError === false && queryLoading === false && idCommentReal !== null) && (
                                                <div className=' relative'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`${showOptionComment ? 'block' : 'hidden'} h-4 w-4 ml-3 group-hover:block cursor-pointer`} viewBox="0 0 20 20" fill="gray" onClick={ () => setShowOptionComment(prevState => !prevState)}>
                                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    </svg>  
                                                    {
                                                        showOptionComment && (
                                                        <div className=' absolute w-72 bg-white rounded-md shadow-md shadow-slate-400 p-2 text-left' ref={ref}>
                                                            <p className=' font-semibold text-sm hover:bg-slate-300 cursor-pointer py-2 pl-2' onClick={() => setEditComentMode(prevState => !prevState)}>
                                                                Edit
                                                            </p>
                                                            <p className=' font-semibold text-sm hover:bg-slate-300 cursor-pointer py-2 pl-2' onClick={() => {
                                                                setShowOptionComment(false);
                                                                setShowDeleteModal(true)
                                                            }}>
                                                                Delete
                                                            </p>
                                                        </div>
                                                        )
                                                    }
                                                </div>
                                            )     
                                        }
                                        
                                    </div>
                                    <span className='flex mt-1 px-3'>
                                        {
                                            (idCommentReal !== null && (queryError === false && queryLoading === false)) && (
                                                <>
                                                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Like</p>
                                                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Reply</p>
                                                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline'>See translation</p>
                                                </>
                                            )
                                        }
                                        {
                                            (idCommentReal === null && createError === true) ? (
                                                <>
                                                    <p className=' text-xs text-gray-500 hover:underline mr-1'>Unable to </p>
                                                    <p className=' text-xs text-gray-500 mr-1'>post comment. </p>
                                                    <p className=' text-xs cursor-pointer hover:underline text-blue-600'>Try again</p>
                                                </>
                                            ) : (queryError === true) && (
                                                <Fragment>
                                                    <p className=' text-xs text-gray-500 hover:underline mr-1'>Unable to </p>
                                                    {
                                                        (errorDelete === true) ? (
                                                        <>
                                                            <p className=' text-xs text-gray-500 mr-1'>delete comment. </p>
                                                            <p className=' text-xs cursor-pointer hover:underline text-blue-600'>Try again</p>
                                                        </>
                                                        ) : (
                                                        <>
                                                            <p className=' text-xs text-gray-500 mr-1'>edit comment. </p>
                                                            <p className=' text-xs cursor-pointer hover:underline text-blue-600'>Try again</p>
                                                        </>
                                                        )
                                                    }
                                                </Fragment>
                                            )
                                        }
                                    </span>
                                </span>
                            ) : (
                                <div className=' flex flex-col items-start'>
                                    <input 
                                        type="text" 
                                        value={editText} 
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder='Write a comment...' 
                                        className=' flex-1 focus:outline-none bg-gray-100 rounded-lg px-3'
                                        onKeyDown={handleEditNewComment}
                                    />
                                    <p className=' text-xs text-slate-500 pt-1'>Press Esc to &nbsp;
                                        <span 
                                            className=' text-sm text-blue-500 font-semibold cursor-pointer' 
                                            onClick={() => { setEditComentMode(false); setShowOptionComment(false) }}
                                        >
                                            cancel
                                        </span>
                                    </p>
                                </div>
                            )
                        }

                    </div>
                )
            }
                
            
        
            {
                showDeleteModal && (
                    <ModalDeleteNewComment 
                        onChageShowDeleteModal = {onChageShowDeleteModal}
                        onChageShowOptionComment = {onChageShowOptionComment}
                        idCommentReal = {idCommentReal!}
                        idCommentTemp = {props.comment.idCommentTemp!}
                        deleteNewComment={handleDeleteNewComment}
                    />
                    
                )
            }
        </Fragment>      
    )
}