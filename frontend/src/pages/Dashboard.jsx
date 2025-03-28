import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHabits, addHabit, deleteHabit } from "../services/api";
import { supabase } from "../../supabaseClient";
import HabitForm from "../components/HabitForm";

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

  const fetchUserHabits = async () => {
    setIsLoading(true);
    if (userEmail) {
      try {
        const data = await fetchHabits();
        setHabits(data);
      } catch (error) {
        console.log("Error fetching habits: ", error);
      } finally {
        setIsLoading(false);
      }
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
  const handleAddHabit = async (newHabit, e) => {
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
    <div className="flex flex-grow w-full min-h-screen">
      <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
        {/* Left-hand nav */}
        <h2 className="text-lg font-bold mb-4">Habit Tracker</h2>
        <div id="topnav" className="flex flex-1">
          <ul>
            <li className="mt-2 hover:bg-gray-700 p-2 rounded">
              <button>Create Task</button>
            </li>
            <li className="mt-2 hover:bg-gray-700 p-2 rounded">
              <a href="#">Daily Tasks</a>
            </li>
            <li className="mt-2 hover:bg-gray-700 p-2 rounded">
              <a href="#">Projects</a>
            </li>
            <li className="mt-2 hover:bg-gray-700 p-2 rounded">
              <a href="#">Achievements</a>
            </li>
            <li className="mt-2 hover:bg-gray-700 p-2 rounded">
              <a href="#">Streaks</a>
            </li>
            <li className="mt-2 hover:bg-gray-700 p-2 rounded">
              <a href="#">Explore</a>
            </li>
          </ul>
        </div>
        <div id="botnav" className="flex flex-col justify-end">
          <div>
            <div>
              <ul>
                <li className="mt-2 hover:bg-gray-700 p-2 rounded">
                  <a href="#">Invite</a>
                </li>
                <li className="mt-2 hover:bg-gray-700 p-2 rounded">
                  <a href="#">Daily Tasks</a>
                </li>
                <li className="mt-2 hover:bg-gray-700 p-2 rounded">
                  <a href="#">Settings</a>
                </li>
              </ul>
            </div>
          </div>
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
      </div>
      <div className="flex-1 grid grid-rows-2 grid-cols-2 gap-4 p-5">
        {/* Overview: Top Left */}
        <div className="row-span-1 col-span-1 border-2 border-solid p-4">
          <h2>Overview</h2>
          {/* Overview content goes here */}
        </div>

        {/* Projects and Tasks: Full Right Column */}
        <div className="row-span-2 col-span-1 border-2 border-solid p-4">
          <h2>Projects and Tasks</h2>
          {/* Projects and tasks content goes here */}
          <HabitForm
            newHabit={newHabit}
            onAddHabit={handleAddHabit}
            onHabitChange={setNewHabit}
          />
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

        {/* Bottom Left: Placeholder */}
        <div className="row-span-1 col-span-1 border-2 border-solid p-4">
          <h2>Placeholder</h2>
          {/* Future content goes here */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
