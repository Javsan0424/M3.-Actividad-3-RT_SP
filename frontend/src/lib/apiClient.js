import Stomp from "stompjs";

const API_URL = "http://77.42.32.142:3001";

let stompClient = null;



/**
 * Obtiene el estado actual del partido
 */
export async function fetchMatch() {
  const res = await fetch(`${API_URL}/api/match`);
  return res.json();
}

/**
 * Obtiene la lista de eventos
 */
export async function fetchEvents() {
  const res = await fetch(`${API_URL}/api/events`);
  return res.json();
}

/**
 * Actualiza el marcador
 */
export async function updateScore(matchId, homeScore, awayScore) {
  const res = await fetch(`${API_URL}/api/match/${matchId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ homeScore, awayScore }),
  });
  return res.json();
}

/**
 * Reinicia el marcador
 */
export async function resetScore(matchId) {
  const res = await fetch(`${API_URL}/api/match/${matchId}/reset`, {
    method: "POST",
  });
  return res.json();
}

/**
 * Agrega un evento
 */
export async function addEvent(eventType, minute, description) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      minute: minute || null,
      description: description || null,
    }),
  });
  return res.json(); 
}

/**
 * Se conecta a WebSocket y suscribe a actualizaciones
 * Retorna una función de cleanup
 */
export function subscribeToUpdates(onMatchUpdate, onEventAdded, onError) {
  return new Promise((resolve) => {
    const url = `${API_URL}/ws/match`;
    stompClient = Stomp.client(url);

    stompClient.connect(
      {},
      () => {
        console.log("WebSocket conectado");

        // Suscribirse a actualizaciones del marcador
        stompClient.subscribe("/topic/match/update", (message) => {
          const match = JSON.parse(message.body);
          onMatchUpdate(match);
        });

        // Suscribirse a nuevos eventos
        stompClient.subscribe("/topic/match/event", (message) => {
          const event = JSON.parse(message.body);
          onEventAdded(event);
        });

        resolve(() => {
          if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => console.log("WebSocket desconectado"));
          }
        });
      },
      (error) => {
        console.error("Error en WebSocket:", error);
        onError(error);
        resolve(() => {});
      },
    );
  });
}
