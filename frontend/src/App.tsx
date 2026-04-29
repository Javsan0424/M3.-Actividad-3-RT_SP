import { useEffect, useRef, useState } from "react";
import { withError } from "./lib/withErrors";
import { Match, MatchEvent } from "./types";
import EventFeed from "./components/EventFeed";

import {
  fetchMatch,
  fetchEvents,
  updateScore,
  resetScore,
  addEvent,
  subscribeToUpdates,
} from "./lib/apiClient";
import Scoreboard from "./components/Scoreboard";
import NewEventForm from "./components/NewEventForm";
import ToastContainer from "./components/ToastContainer";

export interface Toast extends MatchEvent {
  toastId: number;
}

export default function App() {
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<string>("conectando...");
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const localEventIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        const matchData = await fetchMatch();
        setMatch(matchData);

        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    async function connectWs() {
      try {
        cleanup = await subscribeToUpdates(
          (matchData: Match) => setMatch(matchData),
          (event: MatchEvent) => {
            setEvents((prev) => {
              if (prev.some((e) => e.id === event.id)) return prev;
              return [event, ...prev];
            });

            if (localEventIds.current.has(event.id)) {
              localEventIds.current.delete(event.id);
            } else {
              setToasts((prev) => [
                ...prev,
                { ...event, toastId: Date.now() },
              ]);
            }
          },
          (err: Error) => {
            console.error("WebSocket error:", err);
            setError("Error en conexión WebSocket");
          }
        );
        setWsStatus("conectado");
      } catch (err: unknown) {
        setError("No se pudo establecer conexión WebSocket");
      }
    }

    connectWs();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  async function handleAddEvent(
  eventType: string,
  minute: number | null,
  description: string | null,
  ) {
  await withError(() => addEvent(eventType, minute, description), setError);
  }

  async function goalHome() {
    if (!match) return;
    await withError(
    () => updateScore(match.id, match.homeScore + 1, match.awayScore),
    setError,
    );
    }

  async function goalAway() {
    if (!match) return;
    await withError(
    () => updateScore(match.id, match.homeScore, match.awayScore + 1),
    setError,
    );
    }
  
    async function handleReset() {
    if (!match) return;
    await withError(() => resetScore(match.id), setError);
    }

    

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
      <ToastContainer
        toasts={toasts}
        onDismiss={(id: number) => setToasts((prev) => prev.filter((t) => t.toastId !== id))}
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
        onEventCreated={(id: string) => localEventIds.current.add(id)}
      />

      <EventFeed events={events} />
    </div>
  );
}