import React, { Fragment, memo, useState } from 'react'
import SelectUserProfile from './SelectUserProfile'

type PropsType = {
    friendsProfile: {
        idUser: string
        photoUrl: string
        name: string
    } [],
    setAccessExceptions: (data: Array<String>) => void,
}

type userProfileType = {
    idUser: string
    photoUrl: string
    name: string
}


function ModalAccessExceptFriends(props: PropsType) {

    const [accessExceptions, setAccessExceptions] = useState<Array<String>>([])
    
    function addAccessExceptions(data: String){
        const index = accessExceptions.indexOf(data);
        if (index <= -1) {
            setAccessExceptions( prevState => [...prevState, data])
        }
    }

    function removeAccesExceptions(data: String){
        const index = accessExceptions.indexOf(data);
        if (index > -1) {
            accessExceptions.splice(index, 1); 
        }
    }

    return (
        <Fragment>
            
            <div className=' flex mt-10 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="gray">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input type="text" placeholder='Search for a friend or list...' className=' flex-1 focus:outline-none'/>
            </div>

            <div className=' mt-5'>
                <p className=' font-semibold'>Friends</p>
            </div>
            {
                props.friendsProfile.map((friend: userProfileType) => {
                    return (
                        <SelectUserProfile 
                            key={friend.idUser} 
                            friend={friend} 
                            type={'except'} 
                            addAccessExceptions={ (data: String) => addAccessExceptions(data) }
                            removeAccesExceptions={ (data: String) => removeAccesExceptions(data) }
                        />
                    );
                })
            }
            <div className=' flex justify-end'>
                <button className=' rounded-md py-2 px-7 font-semibold text-sm text-blue-600'>Cancel</button>
                <button 
                    type='button'
                    className=' bg-blue-600 rounded-md py-2 px-7 font-semibold text-sm ml-3 text-white' 
                    onClick={
                        () => props.setAccessExceptions(accessExceptions)}>
                        Save Changes
                </button>
            </div>

        </Fragment>
    )
}

export default memo(ModalAccessExceptFriends)