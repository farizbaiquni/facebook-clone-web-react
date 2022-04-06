import React, { Fragment, memo, useState } from 'react'
import SelectUserProfile from './SelectUserProfile'
import { modalShowOption } from '../../constants/ModalPostInput'
import type { userProfileType } from '../../constants/EntityType'
import { accessTypeOption } from '../../constants/ModalPostInput'

type PropsType = {
    friendsProfile: userProfileType [],
    setAccessAllowed: (data: Array<String>) => void,
    setModalShowSpecific: (data: string) => void,
    accessExceptionsState: Array<String>,
    setAccessExceptionsState: (data: Array<String>) => void
    setAccessType: (data: string) => void,
    idFriends: Array<String>,
}


function ModalAccessExceptFriends(props: PropsType) {

    const [accessExceptionsState, setAccessExceptionsState] = useState(new Set<String>(props.accessExceptionsState))
    
    function addAccessExceptions(idUser: String){
        accessExceptionsState.add(idUser)
        console.log(accessExceptionsState)
    }

    function removeAccessExceptions(idUser: String){
        accessExceptionsState.delete(idUser)
        console.log(accessExceptionsState)
    }

    const handleSaveChanges = () => {
        let tempAccessAllowed: Array<String> = []
        props.idFriends.forEach( item => !accessExceptionsState.has(item) && tempAccessAllowed.push(item))
        props.setAccessAllowed(tempAccessAllowed)
    }

    return (
        <Fragment>
            {/* Top bar modal */}
            <div className=' flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={ () =>
                    props.setModalShowSpecific(modalShowOption.access) }>
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                <p className=' flex-1 text-center text-lg font-bold'>Friends Except...</p>
            </div>

            <div className=' flex mt-10 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="gray">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input type="text" placeholder='Search for a friend or list...' className=' flex-1 focus:outline-none'/>
            </div>

            <div className=' mt-5'>
                <p className=' font-semibold'>Friends</p>
            </div>


            <div className='overflow-x-hidden overflow-y-auto h-80'>
            {
                props.friendsProfile.map((friend: userProfileType) => {
                    return (
                        <SelectUserProfile 
                            key={friend.idUser} 
                            friend={friend} 
                            type={'except'} 
                            addAccessExceptions={ (data: String) => addAccessExceptions(data) }
                            removeAccessExceptions={ (data: String) => removeAccessExceptions(data) }
                            isChecked={ props.accessExceptionsState.includes(friend.idUser) }
                        />
                    );
                })
            }
            </div>
            

            <div className=' flex justify-end'>
                <button type='button' className=' rounded-md py-2 px-7 font-semibold text-sm text-blue-600'
                    onClick={() => props.setModalShowSpecific(modalShowOption.main)}
                >
                    Cancel
                </button>
                <button 
                    type='button'
                    className=' bg-blue-600 rounded-md py-2 px-7 font-semibold text-sm ml-3 text-white' 
                    onClick= { () => {
                            handleSaveChanges()
                            props.setAccessExceptionsState(Array.from(accessExceptionsState) as String[])
                            props.setModalShowSpecific(modalShowOption.main)
                            props.setAccessType(accessTypeOption.except)
                        }
                    }>
                        Save Changes
                </button>
            </div>

        </Fragment>
    )
}

export default memo(ModalAccessExceptFriends)