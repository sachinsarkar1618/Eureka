import ContestForm from '@/components/HomePageForm'
import RecentAnswers from '@/components/RecentAnswers'
import RecentlyRequested from '@/components/RecentlyRequested'
import React from 'react'

const page = async () => {


  return (
    <div>
      <ContestForm/>
      <RecentAnswers/>
      <RecentlyRequested/>
    </div>
  )
}

export default page