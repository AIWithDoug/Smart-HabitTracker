import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHabits, addHabit, deleteHabit } from "../services/api";
import { supabase } from "../../supabaseClient";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Refined use effect
  useEffect(() => {
    checkUserSession();
    fetchUserHabits();
  }, []);

  // Updated Fetch Habit functionality
  const fetchUserHabits = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHabits();
      setHabits(data);
    } catch (error) {
      console.log("Error fetching habits: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Checking User Session
  const checkUserSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail("");
    }
  };

  // Handle signing out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail("");
    //potentially setup redirect to login page
  };

  // Handle signing in
  const handleSignInRed = () => {
    navigate("/login");
  };

  // Handle submitting a new habit
  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) {
      setError("Habit name cannot be empty");
      return;
    }
    setError(null);

    try {
      await addHabit(newHabit);
      const updatedHabits = await fetchHabits(); // Refetch latest from backend
      setHabits(updatedHabits);
      setNewHabit(""); // Clear input field
    } catch (error) {
      setError("Failed to add habit. Please Try again.");
      console.error("Error adding habit: ", error);
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
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        {/* Left-hand nav */}
        <h2 className="text-lg font-bold mb-4">Habit Tracker</h2>
        <ul>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">
            <a href="#">Create Task</a>
          </li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">
            <a href="#">Daily Tasks</a>
          </li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">
            <a href="#">List Option</a>
          </li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">
            <a href="#">List Option</a>
          </li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">
            <a href="#">List Option</a>
          </li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">
            <a href="#">List Option</a>
          </li>
        </ul>
        {userEmail && (
          <div className="mt-4">
            <p className="text-sm mb-2">Signed in as: {userEmail}</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        )}
        {!userEmail && (
          <div className="mt-4">
            <button
              onClick={handleSignInRed}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow p-10">
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
    </div>
  );
}

export default Dashboard;
