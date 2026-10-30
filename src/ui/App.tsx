import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import TabBar from './components/tabBar';
import Schedules from './pages/Schedules';
import Practice from './pages/Practice';
import Analytics from './pages/Analytics';
import Settings from './pages/settings';
import Submission from './pages/Submission';

function App() {
  
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <TabBar/>
          <Routes>
            <Route path="/" element={<Schedules />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/submission" element={<Submission/>}/>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
