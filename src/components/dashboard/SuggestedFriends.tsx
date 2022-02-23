import React, { useState } from 'react'
import AddFriendCard from './AddFriendCard'

export default function SuggestedFriends() {
  
    const[suggestedFriends, setSuggestedFriends] = useState([1, 2, 3, 4, 5, 6, 7, 8])

    return (
        <div className=' overflow-x-auto overflow-y-hidden grid gap-1 grid-flow-col'>
            {
                suggestedFriends.map((value, index) => (
                    <AddFriendCard />
                ))
            }
        </div>
    )
}
