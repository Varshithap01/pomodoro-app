import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AboutPage from "./AboutPage";
import PomodoroPage from './PomodoroPage.jsx';
import TaskListPage from './TaskListPage.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-600 p-4 shadow-md">
        <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center text-white">
          <li>
            <Link to="/" className="hover:underline">About</Link>
          </li>
          <li>
            <Link to="/pomodoro" className="hover:underline">Pomodoro Timer</Link>
          </li>
          <li>
            <Link to="/tasks" className="hover:underline">Task List</Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {location.pathname === '/pomodoro' && (
          <p className="text-center text-gray-600 mt-2">You are on the Pomodoro Timer page!</p>
        )}
      </main>
    </div>
  );
}

export default App;
