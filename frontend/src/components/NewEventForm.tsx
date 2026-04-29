import React, { useState, FormEvent } from 'react';
import { MatchEvent } from "../types";
import { EVENT_TYPES} from "../constant/events";

interface Props {
onAddEvent: (
eventType: string,
minute: number | null,
description: string | null,
) => Promise<void>;
onEventCreated?: (id: number) => void; // para Tarea C
}

export interface Match {
  id: string;
  homeScore: number;
  awayScore: number;
  matchName: string;
  updatedAt: string;
}

interface EventResult {
  id: string;
}

interface ScoreboardProps {
  match: Match;
  onGoalHome: () => void;
  onGoalAway: () => void;
  onReset: () => void;
}

interface NewEventFormProps {
  onAddEvent: (
    type: string,
    minute: number | null,
    description: string | null
  ) => Promise<EventResult | null | undefined>;
  onEventCreated?: (id: string) => void;
}


// --- Componente Scoreboard ---
export function Scoreboard({ match, onGoalHome, onGoalAway, onReset }: ScoreboardProps) {
  return (
    <div style={styles.card}>
      <p style={styles.matchName}>{match.matchName}</p>
      <div style={styles.score}>
        {match.homeScore} : {match.awayScore}
      </div>
      <p style={styles.timestamp}>
        Última actualización: {new Date(match.updatedAt).toLocaleTimeString()}
      </p>
      <div style={styles.buttons}>
        <button onClick={onGoalHome} style={btn("#e94560")}>+1 Local</button>
        <button onClick={onGoalAway} style={btn("#e94560")}>+1 Visitante</button>
        <button onClick={onReset} style={btn("#444")}>Reiniciar</button>
      </div>
    </div>
  );
}

// --- Componente NewEventForm ---
export default function NewEventForm({ onAddEvent, onEventCreated }: NewEventFormProps) {
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [minute, setMinute] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const event = await onAddEvent(
      eventType,
      minute ? parseInt(minute, 10) : null,
      description.trim() || null,
    );

    if (event?.id && onEventCreated) {
      onEventCreated(event.id);
    }

    setMinute("");
    setDescription("");
    setLoading(false);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>Agregar evento</h3>
      <div style={styles.row}>
        <div>
          <label style={styles.label}>Tipo de evento</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={styles.input}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Minuto</label>
          <input
            type="number"
            min="0"
            max="120"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="45"
            style={{ ...styles.input, width: '64px' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '160px' }}>
          <label style={styles.label}>Descripción (opcional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción breve..."
            style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.submitBtn, alignSelf: 'flex-end' }}
        >
          {loading ? '...' : sent ? 'Enviado' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}

// --- Utilidades de Estilo ---
function btn(background: string): React.CSSProperties {
  return {
    background,
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1.2rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
  };
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#1a1a2e",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  matchName: {
    margin: "0 0 0.4rem",
    fontSize: "1rem",
    color: "#aaa",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  score: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    margin: "0.4rem 0",
    letterSpacing: "0.1em",
  },
  timestamp: {
    fontSize: "0.78rem",
    color: "#666",
    margin: "0 0 1rem",
  },
  buttons: {
    display: "flex",
    gap: "0.6rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  form: {
    background: '#f5f5f5',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  title: { margin: '0 0 0.75rem', fontSize: '1rem', color: '#333' },
  row: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  label: {
    display: 'block',
    fontSize: '0.72rem',
    marginBottom: '3px',
    color: '#555',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    padding: '0.4rem 0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    height: '34px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0 1.2rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    height: '34px',
  },
};