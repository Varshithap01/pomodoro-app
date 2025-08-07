import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { startOfWeek, endOfWeek, isSameWeek } from 'date-fns';
import { tasksCollectionRef } from './taskService';
import AISuggestions from './AISuggestions';

function Dashboard() {
  const [weeklySessions, setWeeklySessions] = useState({});
  const [totalSessions, setTotalSessions] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalWorkTime: 0, totalSessions: 0, efficiency: 0 });
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    efficiency: 0,
  });

  // 🧠 Fetch Pomodoro sessions and calculate weekly + total stats
  useEffect(() => {
    const fetchSessions = async () => {
      const snapshot = await getDocs(collection(db, 'pomodoroSessions')); // ✅ Corrected collection
      const sessions = snapshot.docs.map(doc => doc.data());

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      let weeklyData = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      let total = 0;
      let totalWorkTime = 0;

      sessions.forEach((session) => {
        const sessionDate = session.date?.toDate?.(); // Firestore Timestamp
        const day = sessionDate?.toLocaleDateString('en-US', { weekday: 'short' });

        if (sessionDate && isSameWeek(sessionDate, now, { weekStartsOn: 1 })) {
          if (weeklyData[day] !== undefined) {
            weeklyData[day]++;
            totalWorkTime += session.duration || 0;
          }
        }
        total++;
      });

      const weeklySessionsCompleted = Object.values(weeklyData).reduce((a, b) => a + b, 0);
      const efficiency = weeklySessionsCompleted > 0
        ? totalWorkTime / (weeklySessionsCompleted * 25)
        : 0;

      setWeeklySessions(weeklyData);
      setTotalSessions(total);
      setStats({
        totalWorkTime,
        totalSessions: weeklySessionsCompleted,
        efficiency,
      });
    };

    fetchSessions();
  }, []);

  // 📋 Fetch tasks and calculate task efficiency
  useEffect(() => {
    const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
      const taskData = snapshot.docs.map(doc => doc.data());

      setTasks(taskData);

      const total = taskData.length;
      const completed = taskData.filter(task => task.completed).length;
      const efficiency = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

      setTaskStats({ total, completed, efficiency });
    });

    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const tasksData = querySnapshot.docs.map((doc) => doc.data());
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchPomodoros = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pomodoroSessions'));
        setPomodoroSessions(querySnapshot.docs.length);
      } catch (error) {
        console.error('Error fetching pomodoro sessions:', error);
      }
    };

    fetchTasks();
    fetchPomodoros();

    return () => unsubscribe(); // ✅ Properly placed cleanup
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">📊 Productivity Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pomodoro Weekly Summary */}
        <div className="bg-blue-400 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Pomodoro: Weekly Summary</h2>
          <ul>
            {Object.entries(weeklySessions).map(([day, count]) => (
              <li key={day}>
                <strong>{day}:</strong> {count} sessions
              </li>
            ))}
          </ul>
        </div>

        {/* Pomodoro Efficiency */}
        <div className="bg-purple-400 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Weekly Productivity Stats</h2>
          <p>Total Work Time: <strong>{stats.totalWorkTime}</strong> minutes</p>
          <p>Total Pomodoro Sessions: <strong>{stats.totalSessions}</strong></p>
          <p>Efficiency: <strong>{(stats.efficiency * 100).toFixed(2)}%</strong></p>
        </div>

        {/* Pomodoro All-Time Summary */}
        <div className="bg-blue-400 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Pomodoro: All-Time</h2>
          <p>Total Sessions: <strong>{totalSessions}</strong></p>
          {totalSessions >= 15 && <p className="text-green-600 font-semibold">🏆 Focused Week!</p>}
        </div>

        {/* Task Productivity Summary */}
        <div className="bg-green-400 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Tasks Productivity</h2>
          <p>Total Tasks: <strong>{taskStats.total}</strong></p>
          <p>Completed: <strong>{taskStats.completed}</strong></p>
          <p>Efficiency: <strong>{taskStats.efficiency}%</strong></p>
          {taskStats.efficiency >= 80 && <p className="text-white font-semibold">🔥 Productive!</p>}
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="bg-white rounded shadow p-4 mb-6">
          <p>Total Tasks: {totalTasks}</p>
          <p>Completed Tasks: {completedTasks}</p>
          <p>Pomodoro Sessions: {pomodoroSessions}</p>
        </div>

        {/* 👇 AI Suggestion Component */}
        <AISuggestions
          stats={{
            completedTasks,
            totalTasks,
            pomodoroSessions,
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
