import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  return (
    <React.Fragment>
        <Navbar />
        <div className=' flex justify-between mt-5'>
            <LeftSidebar />
        </div>

    </React.Fragment>
  )
}