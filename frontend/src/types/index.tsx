export interface Match {
id: number;
matchName: string;
homeScore: number;
awayScore: number;
updatedAt: string;
}

export interface MatchEvent {
id: string;
eventType: string;
minute: number | null;
description: string | null;
createdAt: string;
}

export interface CreateEventPayload {
eventType: string;
minute: number | null;
description: string | null;
}

