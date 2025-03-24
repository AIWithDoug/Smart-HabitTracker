function HabitForm({ onAddHabit, onHabitChange, newHabit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.trim() === "") {
      console.log("Input can't be empty"); //Update to display jsx later
      return;
    }
    onAddHabit(newHabit, e);
    onHabitChange("");
  };

  return (
    <div>
      {/* Add New Habit Form */}
      <h2 className="text-3xl font-bold mb-4">Your Habits</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex items-center">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => onHabitChange(e.target.value)}
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
    </div>
  );
}

export default HabitForm;
