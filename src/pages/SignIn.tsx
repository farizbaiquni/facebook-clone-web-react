import React from 'react'

export const SignIn = () => {
    return (
        <main className='flex flex-col justify-center items-center h-100vh min-lg:flex-row'>
            <div className="left_side w-500 bg-red-800 lg:w-600">
                <img src={process.env.PUBLIC_URL + './facebook_text.svg'} alt="facebook" className=' w-80 max-lg:mx-auto' />
                <h1 className='text-3xl text-left min-lg:ml-8 max-lg:text-2xl max-lg:text-justify min-lg:tracking-widest'>Facebook helps you connect and share with the people in your life.</h1>
            </div>
            <div className="right_side">
                <form action="" className='w-500 border-2 border-slate-300 pt-14 pb-8 px-5 rounded-md'>

                    <input typeof='email    ' id="name-with-label" className="rounded-md border-transparent flex-1 appearance-none border border-gray-300 w-full py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent" name="email" placeholder="Email address or phone number"/>
                    <input typeof='password' id="name-with-label" className="rounded-md border-transparent flex-1 appearance-none border border-gray-300 w-full py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent mt-3" name="email" placeholder="Password"/>

                    
                    <button type="button" className="py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-indigo-200 text-white text-lg font-bold w-full transition ease-in duration-200 text-center shadow-md focus:outline-none focus:0 ring-2 focus:ring-offset-2 rounded-lg mt-5">
                        Log In
                    </button>

                    <p className=' text-sm text-blue-600 mt-3 cursor-pointer'>Forgotten password ?</p>

                    <button type="button" className="py-3 px-4 bg-green-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-indigo-200 text-white text-lg font-bold transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-9">
                        Create New Account
                    </button>

                </form>
                    <p className='text-sm mt-5'><span className=' font-semibold cursor-pointer'>Create a Page</span> for a celebrity, brand or business.</p>
            </div>
        </main>
    )
}
