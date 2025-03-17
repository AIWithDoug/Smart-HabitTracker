import { supabase } from "../../supabaseClient";

const API_BASE_URL = "http://127.0.0.1:8000";

//Retrieve Session Token
async function getAuthToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error("No Valid Session");
  }
  return session.access_token;
}

const token = await getAuthToken();

export async function fetchHabits() {
  const response = await fetch("http://127.0.0.1:8000/habits", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(
      "Failed to fetch habits, failed in api.js",
      await response.text()
    ); // 🟢 Debug log
    throw new Error("Failed to fetch habits, failed in api.js");
  }

  return response.json();
}

export async function fetchQuotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes`);
    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addHabit(name) {
  const response = await fetch("http://127.0.0.1:8000/habits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to add habit");
  }
  return await response.json();
}

export async function deleteHabit(id) {
  const response = await fetch(`http://127.0.0.1:8000/habits/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete habit :(");
  }
  return await response.json();
}
