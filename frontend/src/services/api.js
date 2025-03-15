const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchHabits() {
  try {
    const response = await fetch(`${API_BASE_URL}/habits`);
    if (!response.ok) {
      throw new Error("Failed to fetch habits");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
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
    headers: { "Content-Type": "application/json" },
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
  });
  if (!response.ok) {
    throw new Error("Failed to delete habit :(");
  }
  return await response.json();
}
