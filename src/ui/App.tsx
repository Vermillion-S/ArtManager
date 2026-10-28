import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './App.css'
import TabBar from './components/tabBar';
import Schedules from './pages/Schedules';
import Practice from './pages/Practice';
import Analytics from './pages/Analytics';
import Settings from './pages/settings';

function App() {
  
  return (
    <>
      <TabBar/>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Schedules />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </div>

    </>
  )
}

export default App
