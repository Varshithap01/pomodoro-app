function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          About Pomodoro & Task Tracker
        </h2>
        <p className="text-gray-600 mb-4">
          Welcome to the Pomodoro & Task Tracker app! This tool helps you boost productivity
          using the Pomodoro Technique and manage your tasks efficiently.
        </p>
        <p className="text-gray-600 mb-4">
          The <strong>Pomodoro Timer</strong> page allows you to work in focused 25-minute
          sessions followed by 5-minute breaks to maintain energy and focus.
        </p>
        <p className="text-gray-600 mb-4">
          The <strong>Task List</strong> page lets you add, track, and complete tasks, keeping
          your workflow organized and productive. Tasks are saved in your browser's local storage.
        </p>
        <p className="text-gray-600 text-center">
          Navigate using the menu above to start your productivity journey!
        </p>
      </div>
    </div>
  );
}

export default AboutPage;