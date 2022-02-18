import React from 'react'
import Modal from 'react-modal';

export default function PostInput() {

    const customStyles = {
        overlay: {
            backgroundColor: 'rgb(255, 255, 255, 0.8)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '600px'
        },
    };
  
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    return (
        <div className="post-input mt-10 w-post m-auto shadow shadow-gray-400">
            <div className="top flex items-center py-3">
                <img src={process.env.PUBLIC_URL + './profile.jpg'} alt="profile-post" className=' rounded-full h-10 w-10 ml-3' />
                <p className=' ml-3 mr-3 cursor-pointer text-gray-600 text-lg w-full text-left' onClick={ openModal }>What's on your mind, fariz?</p>
            </div>
            <div className='bottom flex justify-center py-2'>
                <span className=" flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#f94144">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <p className='ml-1 font-semibold text-gray-600'>Live video</p>
                </span>
                <span className=" flex items-center ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#52b788">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1 font-semibold text-gray-600'>Photo/video</p>
                </span>
                <span className=" flex items-center ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="#f8961e">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1 font-semibold text-gray-600'>Feeling/activity</p>
                </span>
            </div>


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Sign Up"
                ariaHideApp={false}
            >    
                <form action="form-sign-up" className='flex flex-col shadow shadow-2xl'>
                    <div className='flex justify-between w-full mb-7'>
                        <p></p>
                        <p className=' font-bold text-xl'>Create Post</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-1 rounded-full cursor-pointer hover:bg-slate-300" viewBox="0 0 20 20" fill="gray" onClick={closeModal}>
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                       
                    </div>
                </form>
            </Modal>

        </div>
    )
}