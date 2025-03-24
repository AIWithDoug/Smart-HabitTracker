function HabitForm() {
  return (
    <div>
      {/* Add New Habit Form */}
      <h2 className="text-3xl font-bold mb-4">Your Habits</h2>
      <form onSubmit={handleAddHabit} className="mb-4 flex items-center">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter a new habit"
          className="border p-2 mr-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Habit
        </button>
      </form>

      {/* Habits List */}
      <ul>
        {habits.length === 0 ? (
          <p>No habits found.</p>
        ) : (
          habits.map((habit) => (
            <li
              key={habit.id}
              className="mb-2 p-2 border rounded flex justify-between items-center"
            >
              <span>{habit.name}</span>
              <button
                onClick={() => handleDeleteHabit(habit.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default HabitForm;
