export interface Memory {
  id: string;
  title: string;
  source: 'gmail' | 'slack' | 'notion' | 'gpt' | 'claude' | 'apple';
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