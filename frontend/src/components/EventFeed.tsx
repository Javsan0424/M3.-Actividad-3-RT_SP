import React, { CSSProperties } from 'react';
import { MatchEvent } from "../types";
import { EVENT_TYPES } from "../constant/events";

interface Props {
events: MatchEvent[];
}

type EventTypeName = 
  | 'Gol'
  | 'Tarjeta amarilla'
  | 'Tarjeta roja'
  | 'Falta'
  | 'Saque de esquina'
  | 'Offside'
  | 'Sustitución'
  | 'Inicio'
  | 'Medio tiempo'
  | 'Fin del partido'
  | 'Otro';


// Mapeo de iconos con tipos estrictos para autocompletado
const ICON: Record<string, string> = {
  'Gol':              '⚽',
  'Tarjeta amarilla': '🟨',
  'Tarjeta roja':     '🟥',
  'Falta':            '🚫',
  'Saque de esquina': '🚩',
  'Offside':          '🚦',
  'Sustitución':      '🔄',
  'Inicio':           '▶',
  'Medio tiempo':     '⏸',
  'Fin del partido':  '🏁',
  'Otro':             '📌'
};

export default function EventFeed({ events }: Props) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={styles.header}>
        Feed de eventos en vivo
      </h3>

      {events.length === 0 && (
        <p style={styles.empty}>Sin eventos todavía.</p>
      )}

      <ul style={styles.list}>
        {events.map((ev) => (
          <li key={ev.id} style={styles.item}>
            <span style={styles.icon}>{ICON[ev.eventType] ?? '📌'}</span>

            <div style={{ flex: 1 }}>
              <span style={styles.type}>{ev.eventType}</span>
              {ev.minute != null && (
                <span style={styles.minute}> min. {ev.minute}</span>
              )}
              {ev.description && (
                <p style={styles.desc}>{ev.description}</p>
              )}
            </div>

            <span style={styles.time}>
              {new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  header: { 
    margin: '0 0 0.75rem', 
    fontSize: '1rem', 
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '0.5rem'
  },
  empty: { 
    color: '#999', 
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '2rem 0'
  },
  list: { 
    listStyle: 'none', 
    padding: 0, 
    margin: 0 
  },
  item: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  icon:   { fontSize: '1.2rem', lineHeight: 1.2 },
  type:   { fontWeight: 'bold', fontSize: '0.95rem', color: '#222' },
  minute: { color: '#e74c3c', fontSize: '0.85rem', fontWeight: 'bold' },
  desc:   { margin: '4px 0 0', fontSize: '0.85rem', color: '#666', lineHeight: 1.4 },
  time:   { marginLeft: 'auto', fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap' },
};