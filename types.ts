
export interface Memory {
  id: string;
  title: string;
  source: string; // Changed from strict union to string to support dynamic datasets
  sourceId?: string; // To track which dataset/integration generated this
  date: string;
  previewImage?: string;
  content: string;
  tags: string[];
  relatedIds: string[]; // IDs of other memories this one connects to
  x?: number; // For visual positioning
  y?: number;
  scale?: number;
}

export interface Integration {
  id: string;
  name: string;
  icon: string; // Emoji or URL
  description: string;
  connected: boolean;
  type: 'app' | 'knowledge';
  stats: {
    estBubbles: string;
    firstBubbleIn: string;
    totalDuration: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
