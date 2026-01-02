import React, { useState } from 'react';
import { Memory } from '../types';
import { ChevronLeft, ChevronRight, X, ArrowUp, Globe, Trash2 } from 'lucide-react';

interface MemorySidebarProps {
  memory: Memory | null;
  allMemories: Memory[];
  onClose: () => void;
}

const MemorySidebar: React.FC<MemorySidebarProps> = ({ memory, allMemories, onClose }) => {
  const [input, setInput] = useState('');

  if (!memory) return null;

  // Find linked memories from the full list
  const linkedMemories = allMemories.filter(m => memory.relatedIds.includes(m.id));

  // If no linked memories exist (mock data gap), pick 4 random ones to populate the UI
  const displayLinked = linkedMemories.length > 0 
    ? linkedMemories 
    : allMemories.filter(m => m.id !== memory.id).slice(0, 4);

  return (
    <div className="h-full flex flex-col bg-white rounded-[32px] overflow-hidden w-full md:w-[480px] border border-white/20">
      {/* Header Actions */}
      <div className="px-6 py-4 flex justify-between items-center bg-white">
        <div className="flex gap-1 text-gray-400">
            <button className="p-1 hover:text-gray-600"><ChevronLeft size={20} /></button>
            <button className="p-1 hover:text-gray-600"><ChevronRight size={20} /></button>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
        </button>
      </div>

      {/* Content Scroll */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 scrollbar-hide">
        
        {/* Source Icon */}
        <div className="mb-4">
             <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-lg">
                ☁️
             </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 leading-snug">
            {memory.title}
        </h2>
        
        {/* Meta */}
        <div className="text-xs text-gray-400 mb-8 font-medium tracking-wide">
            {memory.date} · {memory.source.charAt(0).toUpperCase() + memory.source.slice(1)}
        </div>

        {/* Section: Hypothesis */}
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">2 hypothesis</h3>
            <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                    It might also be that you'd rather build a small, very devoted cult around Pickle—like a quiet luxury brand—than chase broad but shallow mainstream appeal.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Maybe you want Pickle to feel like a calm inner companion for long-term self-work, so you keep making the brand quiet and anti-dopamine instead of loud and attention-grabbing.
                </p>
            </div>
        </div>

        {/* Input Area (Inline) */}
        <div className="relative mb-10">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add reply to create new understanding..."
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-200 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-white hover:bg-gray-300 transition-colors">
                <ArrowUp size={16} />
            </button>
        </div>

        {/* Section: Linked */}
        <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-gray-900">Linked</span>
                <span className="text-sm text-gray-400">{displayLinked.length}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {displayLinked.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-gray-100 relative">
                             {item.previewImage ? (
                                <img src={item.previewImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                             )}
                             
                             {/* Small icon overlay */}
                             <div className="absolute top-2 right-2 w-6 h-6 bg-white/30 backdrop-blur-md rounded-md flex items-center justify-center text-[10px]">
                                🔗
                             </div>
                        </div>
                        <h4 className="text-xs font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
                            {item.title}
                        </h4>
                        <div className="text-[10px] text-gray-400">
                            Episode · {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 flex justify-between items-center border-t border-gray-50 bg-white">
         <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">@</button>
         <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Trash2 size={18} /></button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Globe size={18} /></button>
         </div>
      </div>
    </div>
  );
};

export default MemorySidebar;