import { supabase } from "../../supabaseClient";

const API_BASE_URL = "http://127.0.0.1:8000";

//Retrieve Session Token
async function getAuthToken() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      return null;
    }
    return session.access_token;
  } catch (err) {
    console.error("Failed to get auth token", err);
    return null;
  }
}

export async function fetchHabits() {
  try {
    const token = await getAuthToken();
    // If no token exists, return empty array
    // if (!token) {
    //   console.log("No authentication token found");
    //   return [];
    // }

    const response = await fetch("http://127.0.0.1:8000/habits", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // If response is 401 (Unauthorized), return empty array without error
    if (response.status === 401) {
      console.log("User not authenticated or token expired");
      return [];
    }

    // For other error status codes, throw an error
    if (!response.ok) {
      console.error(
        "Failed to fetch habits, failed in api.js",
        await response.text()
      );
      throw new Error("Failed to fetch habits, failed in api.js");
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchHabits: ", error);
    return [];
  }
}

//Need to remove
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
  try {
    const token = await getAuthToken();

    // if (!token) {
    //   throw new Error("Authentication required");
    // }

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
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error;
  }
}

export async function deleteHabit(id) {
  try {
    const token = await getAuthToken();

    // if (!token) {
    //   throw new Error("Authentication required");
    // }

    const response = await fetch(`http://127.0.0.1:8000/habits/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete habit");
    }

    return await response.json();
  } catch (error) {
    console.error("Error Deleting Habbit", error);
    throw error;
  }
}
