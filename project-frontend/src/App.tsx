//import { useState } from 'react'
import ProfilePage from './components/ProfilePage'
import './main.css'
function App() {
  const user = {
    id: 1,
    email: "test@example.com",
    userName: "John",
    age: new Date(1990, 1, 1),
    weight: 70,
    height: 175,
    activityCoefId: 2,
    dietId: 1,
    caloriesStandard: 2000
  };
  return (

    
    <>
      <ProfilePage user={user} />
    </>
  )
}

export default App
