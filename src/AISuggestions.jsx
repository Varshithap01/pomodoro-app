import React, { useEffect, useState } from 'react';
import { getAISuggestion } from './openai';

const AISuggestions = ({ stats }) => {
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    const fetchSuggestion = async () => {
      const prompt = `User completed ${stats.completedTasks} out of ${stats.totalTasks} tasks and did ${stats.pomodoroSessions} pomodoro sessions today. Suggest productivity improvements.`;
      const result = await getAISuggestion(prompt);
      setSuggestion(result);
    };

    fetchSuggestion();
  }, [stats]);

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 rounded">
      <h3 className="font-bold text-yellow-700 mb-2">AI Productivity Suggestion</h3>
      <p className="text-gray-800">{suggestion}</p>
    </div>
  );
};

export default AISuggestions;
