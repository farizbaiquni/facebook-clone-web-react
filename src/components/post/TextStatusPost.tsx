import React, { memo } from 'react'

type propsType = {
  textStatusPost: string
}

function TextStatusPost(props: propsType) {
  return (
    <div className="status text-left mt-3">
      <h1 className=''>{ props.textStatusPost }</h1>
    </div>
  )
}

export default memo(TextStatusPost)