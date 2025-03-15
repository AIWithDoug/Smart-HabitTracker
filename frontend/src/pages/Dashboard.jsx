import { useEffect, useState } from "react";
import { fetchHabits, addHabit, deleteHabit } from "../services/api";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState([]);
  const [quotes, setQuotes] = useState([]);

  // Fetch habits from the backend
  useEffect(() => {
    fetchHabits().then((data) => setHabits(data));
  }, []);

  // Fetch quotes from the backend (or leave static later)
  useEffect(() => {
    // If you're hardcoding quotes later, you can replace this
    setQuotes([
      { id: 1, text: "Stay hungry. Stay foolish." },
      { id: 2, text: "Discipline equals freedom." },
      { id: 3, text: "You miss 100% of the shots you don't take." },
    ]);
  }, []);

  // Handle submitting a new habit
  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    try {
      await addHabit(newHabit);
      const updatedHabits = await fetchHabits(); // Refetch latest from backend
      setHabits(updatedHabits);
      setNewHabit(""); // Clear input field
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  // Handle deleting a habit
  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      const updatedHabits = await fetchHabits(); // Refetch latest from backend
      setHabits(updatedHabits);
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Quotes Section */}
      <h2 className="text-3xl font-bold mb-4">Motivational Quotes</h2>
      <ul className="mb-8">
        {quotes.length === 0 ? (
          <p>Sorry, no quotes found!</p>
        ) : (
          quotes.map((quote) => (
            <li key={quote.id} className="mb-2 p-2 border rounded">
              {quote.text}
            </li>
          ))
        )}
      </ul>

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

export default Dashboard;
