import { useEffect, useRef, useState } from "react";
import {
  fetchMatch,
  fetchEvents,
  updateScore,
  resetScore,
  addEvent,
  subscribeToUpdates,
} from "./lib/apiClient";
import Scoreboard from "./components/Scoreboard";
import EventFeed from "./components/EventFeed";
import NewEventForm from "./components/NewEventForm";
import ToastContainer from "./components/ToastContainer";

export default function App() {
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [wsStatus, setWsStatus] = useState("conectando...");
  
  // [C] Estado para los Toasts y referencia para filtrar eventos propios
  const [toasts, setToasts] = useState([]);
  const localEventIds = useRef(new Set());

  // ── Carga inicial ──────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const matchData = await fetchMatch();
        setMatch(matchData);

        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (err) {
        setError(err.message);
      }
    }
    loadData();
  }, []);

  // ── Suscripción WebSocket ──────────────────────────────────
  useEffect(() => {
    let cleanup;

    async function connectWs() {
      try {
        cleanup = await subscribeToUpdates(
          (match) => setMatch(match),
          (event) => {
            // Actualizar feed
            setEvents((prev) => {
              if (prev.some((e) => e.id === event.id)) return prev;
              return [event, ...prev];
            });

            // [C] Lógica del Toast: Filtrar si es evento propio
            if (localEventIds.current.has(event.id)) {
              localEventIds.current.delete(event.id); // Es nuestro, limpiamos el Set
            } else {
              // Es de otro cliente, mostrar notificación
              setToasts((prev) => [
                ...prev,
                { ...event, toastId: Date.now() },
              ]);
            }
          },
          (err) => {
            console.error("WebSocket error:", err);
            setError("Error en conexión WebSocket");
          }
        );
        setWsStatus("conectado");
      } catch (err) {
        setError("No se pudo establecer conexión WebSocket");
      }
    }

    connectWs();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // ── Acciones ───────────────────────────────────────────────
  async function handleAddEvent(eventType, minute, description) {
    try {
      // Devolvemos el evento para capturar el ID en el formulario
      const event = await addEvent(eventType, minute, description);
      return event;
    } catch (err) {
      setError(err.message);
    }
  }

  async function goalHome() {
    if (!match) return;
    try {
      await updateScore(match.id, match.homeScore + 1, match.awayScore);
    } catch (err) { setError(err.message); }
  }

  async function goalAway() {
    if (!match) return;
    try {
      await updateScore(match.id, match.homeScore, match.awayScore + 1);
    } catch (err) { setError(err.message); }
  }

  async function handleReset() {
    if (!match) return;
    try {
      await resetScore(match.id);
    } catch (err) { setError(err.message); }
  }

  // ── Render ─────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ padding: "2rem", color: "#c0392b", fontFamily: "sans-serif" }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!match) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#555" }}>
        Conectando con el servidor... ({wsStatus})
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px", margin: "2rem auto", padding: "0 1rem", fontFamily: "sans-serif" }}>
      {/* Contenedor de Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.toastId !== id))}
      />

      <h1 style={{ fontSize: "1.1rem", color: "#888", marginBottom: "0.5rem", textTransform: "uppercase" }}>
        Panel de Partido en Vivo
      </h1>
      
      <Scoreboard
        match={match}
        onGoalHome={goalHome}
        onGoalAway={goalAway}
        onReset={handleReset}
      />

      <NewEventForm 
        onAddEvent={handleAddEvent} 
        onEventCreated={(id) => localEventIds.current.add(id)} // [C] Guardar ID propio
      />

      <EventFeed events={events} />
    </div>
  );
}