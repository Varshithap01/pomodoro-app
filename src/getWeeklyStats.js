import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { startOfWeek, endOfWeek } from 'date-fns';

export const getWeeklyPomodoroStats = async () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const sessionsQuery = query(
    collection(db, 'pomodoroSessions'),
    where('date', '>=', start),
    where('date', '<=', end)
  );

  const snapshot = await getDocs(sessionsQuery);
  const sessions = snapshot.docs.map(doc => doc.data());

  const totalWorkTime = sessions
    .filter(session => session.sessionType === 'Work')
    .reduce((sum, session) => sum + session.duration, 0);

  const totalSessions = sessions.filter(session => session.sessionType === 'Work').length;

  return {
    totalWorkTime, // in minutes
    totalSessions,
    efficiency: totalWorkTime / (totalSessions * 25) || 0 // Assuming ideal session is 25 min
  };
};
