import React from 'react'
import { BrowserRouter,Route,Router, Routes } from 'react-router-dom'
import CouponPage from './pages/CouponPage.jsx'
import QrCheckPage from './pages/QrCheckPage.jsx'



function App() {
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<QrCheckPage/>} />
      <Route path="/access" element={<QrCheckPage/>} />
      <Route path="/coupon" element={<CouponPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App