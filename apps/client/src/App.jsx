import './App.css'
import Sidebar from './components/Sidebar'
import Kanban from './components/Kanban'

function App() {
  return (
    <div className="app-layout">
      {/* Sidebar blends with background */}
      <Sidebar />

      {/* Main Workspace Window container */}
      <main className="main-content">
        <Kanban />
      </main>
    </div>
  )
}

export default App;