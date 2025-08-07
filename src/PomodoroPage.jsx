import { useState, useEffect } from 'react';
import { saveWorkSession } from './saveWorkSession';
import { getWeeklyPomodoroStats } from './getWeeklyStats';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

function PomodoroPage() {
  const defaultWorkDuration = 25 * 60;
  const shortBreakDuration = 5 * 60;
  const longBreakDuration = 20 * 60;

  const [time, setTime] = useState(defaultWorkDuration);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('Work');
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const [dailyHistory, setDailyHistory] = useState([]);

  // Restore timer state on mount
  useEffect(() => {
    const storedStartTime = localStorage.getItem('pomodoroStart');
    const storedDuration = localStorage.getItem('pomodoroDuration');
    const storedSessionType = localStorage.getItem('pomodoroSessionType');
    const storedWorkSessions = localStorage.getItem('workSessionsCompleted');

    if (storedStartTime && storedDuration && storedSessionType) {
      const elapsed = Math.floor((Date.now() - Number(storedStartTime)) / 1000);
      const remaining = Number(storedDuration) - elapsed;

      if (remaining > 0) {
        setTime(remaining);
        setIsActive(true);
        setSessionType(storedSessionType);
        setWorkSessionsCompleted(Number(storedWorkSessions || 0));
      } else {
        localStorage.removeItem('pomodoroStart');
        localStorage.removeItem('pomodoroDuration');
        localStorage.removeItem('pomodoroSessionType');
        localStorage.removeItem('workSessionsCompleted');
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);

            if (sessionType === 'Work') {
              const newCount = workSessionsCompleted + 1;
              setWorkSessionsCompleted(newCount);

              saveWorkSession('Work', 25);

              if (newCount % 3 === 0) {
                setSessionType('Long Break');
                setTime(longBreakDuration);
              } else {
                setSessionType('Short Break');
                setTime(shortBreakDuration);
              }
            } else {
              saveWorkSession(sessionType, sessionType === 'Long Break' ? 20 : 5);
              setSessionType('Work');
              setTime(defaultWorkDuration);
            }

            localStorage.removeItem('pomodoroStart');
            localStorage.removeItem('pomodoroDuration');
            localStorage.removeItem('pomodoroSessionType');
            localStorage.removeItem('workSessionsCompleted');

            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, sessionType, workSessionsCompleted]);

  // Fetch today's sessions
  const fetchTodaySessions = async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "pomodoroSessions"),
      where("date", ">=", Timestamp.fromDate(start))
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => doc.data());
    setDailyHistory(sessions);
  };

  useEffect(() => {
    fetchTodaySessions();
  }, []);

  const startTimer = () => {
    setIsActive(true);
    localStorage.setItem('pomodoroStart', Date.now().toString());
    localStorage.setItem('pomodoroDuration', time.toString());
    localStorage.setItem('pomodoroSessionType', sessionType);
    localStorage.setItem('workSessionsCompleted', workSessionsCompleted.toString());
  };

  const pauseTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setTime(defaultWorkDuration);
    setSessionType('Work');
    setWorkSessionsCompleted(0);
    localStorage.removeItem('pomodoroStart');
    localStorage.removeItem('pomodoroDuration');
    localStorage.removeItem('pomodoroSessionType');
    localStorage.removeItem('workSessionsCompleted');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {sessionType} Session
      </h2>
      <div className="text-5xl font-mono text-gray-800 mb-6 text-center">
        {formatTime(time)}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={startTimer}
          disabled={isActive}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          disabled={!isActive}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
        >
          Pause
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
      <p className="mt-4 text-gray-600 text-center">
        Work Sessions Completed: {workSessionsCompleted}{' '}
        {workSessionsCompleted > 0 && workSessionsCompleted % 3 === 0 ? '(Long Break Next)' : ''}
      </p>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
          Today's Sessions
        </h3>
        {dailyHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No sessions recorded today.</p>
        ) : (
          <ul className="space-y-1 text-center">
            {dailyHistory.map((session, index) => (
              <li key={index} className="text-gray-600">
                {session.sessionType} - {session.duration} mins
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PomodoroPage;