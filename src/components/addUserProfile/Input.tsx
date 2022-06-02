import { useState } from 'react'
import InvalidInput from '../InvalidInput'

function Input() {
    const [value, setValue] = useState<String>("")
    const [clicked, setClicked] = useState<Boolean>(false)
    const [showToolTip, setShowToolTip] = useState(false)

    return (
        <div className=' flex'>
            <div className=' relative'>
                {
                    (clicked && showToolTip) && (
                        <p className="absolute text-sm bg-red-700 text-white rounded-sm p-3 right-3 bottom-0 w-96">
                            
                        </p>
                    )
                }
            </div>
            <div className="relative text-left">    
                <label htmlFor="on-error-email" className="text-gray-500">
                    First Name
                </label>
                <input type="text" id="on-error-email" onBlur={() => setShowToolTip(false)} onFocus={() => value.trim().length <= 0 && setShowToolTip(true)}  className={`peer rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-0 ${clicked && (value.trim().length <= 0)  && "ring-red-500 ring-1"}`} name="first-name" placeholder="Your email" onClick={() => setClicked(true)} onChange={(e) => setValue(e.target.value) }/>

                {
                    clicked && (value.trim().length <= 0) && (
                        <span className=' peer-focus:hidden' >
                            <InvalidInput /> 
                        </span>
                    )
                
                }
                
            </div>
        </div>
        
    )
}

export default Input