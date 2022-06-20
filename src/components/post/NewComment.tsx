import { Fragment, useCallback, useEffect, useState } from 'react'
import { idNewCommentsType, commentDisplayedType } from '../../constants/EntityType'
import { db } from '../../lib/firebase'

type propsType = {
  comment: commentDisplayedType,
  username: string,
  photoUrl: string | undefined,
  idNewComments: idNewCommentsType[],
  deleteComment: (idComment: string, deletedId: string) => void,
}

export default function NewComment(props: propsType) {
    console.log("====== RE-RENDER NEW COMMENT "+ props.comment.text  +" ======")
    const [idCommentReal, setIdCommentReal] = useState<string | null>(null)

    const checkIsSyncInDB = useCallback(() => {
        props.idNewComments.map(id => {
            if(id.tempId === props.comment.idCommentTemp) {
                setIdCommentReal(id.realId)
            }
        })
    }, [props.idNewComments])

    useEffect(() => {
       if(props.idNewComments != null && props.idNewComments.length > 0 && idCommentReal == null) {
        checkIsSyncInDB()
       }
    }, [props.idNewComments])

    return (
        <Fragment>
        
            <div className=' flex mt-3 group'>
                <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="" className=' h-8 w-8 rounded-full mr-2' />
                <span className=' flex flex-col ml-2'>
                <div className="flex items-center">
                    <span className=' flex flex-col bg-gray-100 px-5 py-2 rounded-lg'>
                    <p className=' text-sm font-semibold text-left'>{props.username}</p>
                    <p className=' text-left'>{props.comment.text}</p>
                    </span>
                    
                    {
                        idCommentReal !== null && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="hidden h-4 w-4 ml-3 group-hover:block" viewBox="0 0 20 20" fill="gray" onClick={ () => props.comment.idCommentTemp && props.deleteComment(idCommentReal, props.comment.idCommentTemp)}>
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        )
                    }
                    
                </div>
                    <span className=' flex mt-1 pl-5'>
                        <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Like</p>
                        <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline mr-4'>Reply</p>
                        <p className=' text-xs font-bold text-gray-500 cursor-pointer hover:underline'>See translation</p>
                    </span>
                </span>

            </div>
        
        </Fragment>      
    )
}