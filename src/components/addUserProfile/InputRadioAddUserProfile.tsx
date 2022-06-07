import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import InvalidInput from '../InvalidInput'
import { radioGenderOption } from '../../constants/EntityType'

type propsType = {
    value: string | null,
    placeholder: string,
    invalid: string,
    onChangeValue: (value: string) => void,
    nextButtonClicked: boolean,
}

function InputRadioAddUserProfile(props: propsType) {
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

    const onChangeRadioGender = (event: ChangeEvent<HTMLInputElement>) => {
        alert(event.target.value)
        props.onChangeValue(event.target.value)
    }

    useEffect(() => {
        if (props.nextButtonClicked === true){
            setClicked(true)
        }
    }, [props.nextButtonClicked])

    return (
        
        <div className=' relative flex'>
            <div className=' relative'>
                {
                    (clicked && showToolTip) && (
                        <p className={`absolute text-sm bg-red-700 text-white rounded-sm p-3 right-3 break-words bottom-0 ${calculateInvalideWidth(props.invalid)}`}>
                            {props.invalid}
                        </p>
                    )
                }
            </div>
            <div className="flex items-center gap-5">
                <label className="inline-flex items-center bg-white rounded-sm p-3">
                    <span className="mr-5 text-gray-700">
                        Female
                    </span>
                    <input type="radio" value={radioGenderOption.female} name="gender" onChange={(event) => onChangeRadioGender(event)} className="h-5 w-5"/>
                </label>
                <label className="inline-flex items-center bg-white rounded-sm p-3">
                    <span className="mr-5 text-gray-700">
                        Male
                    </span>
                    <input type="radio" value={radioGenderOption.male} name="gender" onChange={(event) => onChangeRadioGender(event)} className="h-5 w-5"/>
                </label>
            </div>
            <div>
                {
                    clicked && (props.value === null) && (
                        <span className=' peer-focus:hidden' onClick={() => setShowToolTip(!showToolTip)}>
                            <InvalidInput /> 
                        </span>
                    )
                }
            </div>
        </div>
        
    )
}
export default InputRadioAddUserProfile