import { Integration, Memory } from './types';

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    description: 'Import project details and track the context of important conversations.',
    connected: true,
    stats: { estBubbles: '30-60', firstBubbleIn: '30s', totalDuration: '15m' }
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Extract key insights and memories from your team channels and DMs.',
    connected: true,
    stats: { estBubbles: '150-200', firstBubbleIn: '5m', totalDuration: '40m' }
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📓',
    description: 'Sync your workspace pages, project roadmaps, and structured knowledge.',
    connected: true,
    stats: { estBubbles: '30-60', firstBubbleIn: '1m', totalDuration: '15m' }
  },
  {
    id: 'apple',
    name: 'Voice Memos',
    icon: '🎙️',
    description: 'Transcribe and analyze your voice notes and personal ramblings.',
    connected: true,
    stats: { estBubbles: '12', firstBubbleIn: '30s', totalDuration: '5m' }
  }
];

export const generateMemories = (count: number): Memory[] => {
  const memories: Memory[] = [];
  
  // Specific memories for the Digital Detox scenario
  const specificMemories = [
    {
      title: "Highlighted quote from 'Dopamine Nation'",
      source: 'notion',
      content: "The relentless pursuit of pleasure leads to pain... we are transforming ourselves into simple pleasure-seeking machines.",
      tags: ['Reading', 'Psychology', 'Addiction']
    },
    {
      title: "Experience in subway (Voice Note)",
      source: 'apple',
      content: "October 12th. Felt that phantom vibration in my pocket again. Looking around, everyone is bent over their screens. It feels like we're all together but completely alone. The anxiety of not checking is worse than the boredom.",
      tags: ['Journal', 'Anxiety', 'Observation']
    },
    {
      title: "Is it a tool or a shackle?",
      source: 'gmail',
      content: "Memo to self: We need to define boundaries. If I can't leave the house without a charger, who owns who?",
      tags: ['Philosophy', 'Draft']
    },
    {
      title: "Recap of coffee with Sarah",
      source: 'apple',
      content: "Sarah talked about the 'Comparison Loop'. Seeing everyone's highlights makes me feel like I'm standing still. She suggested a 3-day total disconnect.",
      tags: ['Social', 'Coffee', 'Mental Health']
    },
    {
      title: "Dream Journal: The Silent City",
      source: 'notion',
      content: "Dreamt of a city with no screens. People were looking up. Colors were brighter. Woke up feeling strangely relieved.",
      tags: ['Dream', 'Subconscious']
    }
  ];

  // Add specific memories first
  specificMemories.forEach((item, i) => {
     memories.push({
        id: `mem-detox-${i}`,
        title: item.title,
        source: item.source as any,
        date: 'Oct 2024',
        previewImage: `https://picsum.photos/300/300?random=detox${i}`,
        content: item.content,
        tags: item.tags,
        relatedIds: []
     });
  });

  const sources = ['gmail', 'slack', 'notion', 'gpt', 'apple'] as const;

  // Fill the rest with random data
  for (let i = 0; i < count - specificMemories.length; i++) {
    const id = `mem-${i}`;
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    memories.push({
      id,
      title: `Fragment #${i + 1}: ${source.toUpperCase()} Data`,
      source,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      previewImage: `https://picsum.photos/300/300?random=${i}`,
      content: `Simulated content for graph density. Context derived from ${source} integration.`,
      tags: ['Context', 'Data'],
      relatedIds: []
    });
  }

  // Interconnect the specific detox memories
  const detoxIds = memories.slice(0, 5).map(m => m.id);
  memories[0].relatedIds.push(memories[1].id, memories[2].id); // Quote -> Subway, Tool
  memories[1].relatedIds.push(memories[3].id); // Subway -> Sarah
  memories[3].relatedIds.push(memories[0].id); // Sarah -> Quote
  memories[4].relatedIds.push(memories[2].id); // Dream -> Tool

  // Random connections for the background noise
  memories.slice(5).forEach((mem, idx) => {
    if (Math.random() > 0.8) {
       const target = memories[Math.floor(Math.random() * memories.length)];
       if (target.id !== mem.id) mem.relatedIds.push(target.id);
    }
  });

  return memories;
};