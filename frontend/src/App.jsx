import React from 'react'
import RandomThreads from './components/Threads/Threads'
import { BrowserRouter , Routes , Route } from "react-router-dom"
import Intro from './components/Intro/Intro'
const App = () => {
  return (
 <>
 <BrowserRouter>
 <Routes>
    <Route path="/thread" element={<RandomThreads/>}/>
    <Route path='/' element={ < Intro/> }/>
 </Routes>
 </BrowserRouter>
 </>
  )
}

export default App
