// Endereço base da API. Defina VITE_API_URL em um arquivo .env para mudar;
// sem ele, usa o backend local de desenvolvimento.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5224";
const API_URL = `${API_BASE_URL}/games`;

export async function getGames() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Request error: ${response.status}`);
  }

  return response.json();
}

export async function createGame(newGame) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    });

    if (!response.ok) {
      throw new Error(`Request error: ${response.status} `);
    }

    return await response.json();
  } catch (error) {
    console.error("Creation error : ", error);
    throw error;
  }
}

export async function updateGame(idToUpdate, gameUpdated) {
  try {
    const response = await fetch(`${API_URL}/${idToUpdate}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameUpdated),
    });

    if (!response.ok) {
      throw new Error(`Request error: ${response.status} `);
    }

    return await response.json();
  } catch (error) {
    console.error("Update error : ", error);
    throw error;
  }
}

export async function deleteGame(idToDelete) {
  try {
    const response = await fetch(`${API_URL}/${idToDelete}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Request error: ${response.status} `);
    }

    return await response.json();
  } catch (error) {
    console.error("Deletion failure: ", error);
    throw error;
  }
}
