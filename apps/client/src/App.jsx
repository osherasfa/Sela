// src/App.jsx
import { Outlet, Link, useLocation } from 'react-router'
import './App.css'

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className='app'>
      <nav className='sidemenubar'>
        <Link to="/">Home</Link>
        <Link to="/boards/80ea3630-8c05-468b-9c61-3a41d34bdc6e">Default Kanban Board</Link>
      </nav>
      
      <section className='platform'>
        {isHome ? <h1>Homepage</h1> : <Outlet />}
      </section>
    </div>
  )
}

export default App;