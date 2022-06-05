import { useState } from 'react'
import InvalidInput from '../InvalidInput'

type propsType = {
    value: string,
    placeholder: string,
    invalid: string,
    onChangeValue: (value: string) => void,
}

function InputTextAddUserProfile(props: propsType) {
    const [clicked, setClicked] = useState<Boolean>(false)
    const [showToolTip, setShowToolTip] = useState(false)

    const calculateInvalideWidth = (sentences: string) => {
        const length = sentences.length
        if (length <= 18){
            return "w-40"
        } else if (length > 18 && length <= 36){
            return "w-52"
        } else if (length > 36 && length <= 54){
            return "w-72"
        } else if (length > 54 && length <= 72){
            return "w-80"
        } else {
            return "w-96"
        }
    }

    return (
        <div className=' flex'>
            <div className=' relative'>
                {
                    (clicked && showToolTip) && (
                        <p className={`absolute text-sm bg-red-700 text-white rounded-sm p-3 right-3 break-words bottom-0 ${calculateInvalideWidth(props.invalid)}`}>
                            {props.invalid}
                        </p>
                    )
                }
            </div>
            <div className="relative text-left">
                <input type="text" id="on-error-email" onBlur={() => setShowToolTip(false)} onFocus={() => props.value.trim().length <= 0 && setShowToolTip(true)}  className={`peer rounded-sm border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-0 ${clicked && (props.value.trim().length <= 0)  && "ring-red-500 ring-1"}`} name="first-name" placeholder={props.placeholder} onClick={() => setClicked(true)} onChange={(e) => props.onChangeValue(e.target.value) }/>

                {
                    clicked && (props.value.trim().length <= 0) && (
                        <span className=' peer-focus:hidden' >
                            <InvalidInput /> 
                        </span>
                    )
                
                }
                
            </div>
        </div>
        
    )
}

export default InputTextAddUserProfile