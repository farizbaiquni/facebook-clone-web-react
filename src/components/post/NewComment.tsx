import { doc, updateDoc } from 'firebase/firestore'
import { createRef, Fragment, useCallback, useEffect, useState } from 'react'
import { idNewCommentsType, commentDisplayedType } from '../../constants/EntityType'
import { db } from '../../lib/firebase'

type propsType = {
  comment: commentDisplayedType,
  username: string,
  photoUrl: string | undefined,
  idNewComments: idNewCommentsType[],
  deleteNewComment: (idComment: string, deletedId: string) => void,
  updateTextNewComment: (editText: string, editedId: string) => void,
}

export default function NewComment(props: propsType) {

    console.log("====== RE-RENDER NEW COMMENT "+ props.comment.text  +" ======")

    const [idCommentReal, setIdCommentReal] = useState<string | null>(null)
    const [editText, setEditText] = useState<string>(props.comment.text)
    const [editCommentMode, setEditComentMode] = useState(false)
    const [showOptionComment, setShowOptionComment] = useState(false)
    const ref: React.RefObject<HTMLDivElement> = createRef();


    const checkIsSyncInDB = useCallback(() => {
        props.idNewComments.map(id => {
            if(id.tempId === props.comment.idCommentTemp) {
                setIdCommentReal(id.realId)
            }
        })
    }, [props.comment.idCommentTemp, props.idNewComments])

    const handleEditComment = async(event: React.KeyboardEvent<HTMLInputElement>) => { 
        if(event.code === 'Enter') {
            if(editText.length > 0) {
                if( editText !== props.comment.text && idCommentReal != null && props.comment.idCommentTemp != null) {
                    await updateDoc(doc(db, 'comments', idCommentReal), {
                        "text": editText,
                    }).then(() => props.updateTextNewComment(editText, props.comment.idCommentTemp!!));
                }
            } else {
                //Delete comment confirmation
            }
        }
    }

    useEffect(() => {
        setEditComentMode(false)
        setShowOptionComment(false)
    }, [props.comment.text])


    useEffect(() => {
        if(props.idNewComments != null && props.idNewComments.length > 0 && idCommentReal == null) {
            checkIsSyncInDB()
        }
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

    }, [checkIsSyncInDB, idCommentReal, props.idNewComments, ref, props.comment.text])


    return (
        <Fragment>
        
            <div className=' flex mt-3 group'>
                <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
                {
                    !editCommentMode ? (
                        <span className=' flex flex-col'>
                            <div className="flex items-center">
                                <span className=' flex flex-col bg-gray-100 px-3 py-2 rounded-lg'>
                                <p className=' text-sm font-semibold text-left'>{props.username}</p>
                                <p className=' text-left'>{props.comment.text}</p>
                                </span>
                                
                                {
                                    idCommentReal !== null && (
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
                                                    <p className=' font-semibold text-sm hover:bg-slate-300 cursor-pointer py-2 pl-2' onClick={() => props.comment.idCommentTemp && props.deleteNewComment(idCommentReal, props.comment.idCommentTemp)}>
                                                        Delete
                                                    </p>
                                                </div>
                                                )
                                            }
                                        </div>
                                    )
                                    
                                }
                                
                            </div>
                                <span className=' flex mt-1 px-3'>
                                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Like</p>
                                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Reply</p>
                                    <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline'>See translation</p>
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
                                onKeyDown={handleEditComment}
                            />
                            <p className=' text-sm text-slate-500 pt-1'>Press Esc to &nbsp;
                                <span 
                                    className=' text-sm text-blue-500 cursor-pointer' 
                                    onClick={() => { setEditComentMode(false); setShowOptionComment(false) }}
                                >
                                    cancel
                                </span>
                            </p>
                        </div>
                    )
                }
               
            </div>
        
        </Fragment>      
    )
}