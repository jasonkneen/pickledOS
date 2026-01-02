import React, { useState, useEffect } from 'react';
import { MOCK_INTEGRATIONS, generateMemories } from './constants';
import { Memory, Integration } from './types';
import BubbleGraph from './components/BubbleGraph';
import IntegrationsModal from './components/IntegrationsModal';
import MemorySidebar from './components/MemorySidebar';
import ChatPanel from './components/ChatPanel';
import { Settings, Plus, LayoutGrid, Disc, Target, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{count: number} | null>(null);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  // Global Drag State
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMemories(generateMemories(50)); 
  }, []);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  const handleAddMemory = (newMemory: Memory) => {
      // Find similar memories to link
      const linkedIds = memories
          .slice(0, 3) 
          .map(m => m.id);
      
      const memoryWithLinks = { ...newMemory, relatedIds: linkedIds };
      
      setMemories(prev => [memoryWithLinks, ...prev]);
      setSelectedMemory(memoryWithLinks);
      // Open chat to show the analysis result
      setIsChatOpen(true);
  };

  const handleOpenChatWithContext = () => {
      if (selectedMemory) {
          // Count linked memories
          const linkedCount = memories.filter(m => selectedMemory.relatedIds.includes(m.id)).length;
          setChatContext({ count: linkedCount + 1 }); // +1 for the selected one
          setIsChatOpen(true);
      }
  };

  const handleGlobalDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((f: any) => f.type.startsWith('image/'));
      
      if (imageFile) {
          setDroppedFile(imageFile);
          setIsChatOpen(true); // Open chat to process the file
      }
  };

  return (
    <div 
        className="w-full h-screen bg-[#e8e9eb] p-6 flex overflow-hidden relative selection:bg-blue-100 selection:text-blue-900 gap-6"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleGlobalDrop}
    >
      
      {/* LEFT: Slide-out Chat Panel */}
      <div 
        className={`absolute left-6 top-6 bottom-6 z-40 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isChatOpen ? 'translate-x-0' : '-translate-x-[calc(100%+24px)]'}`}
      >
          <ChatPanel 
            onAddMemory={handleAddMemory}
            selectedMemory={selectedMemory}
            initialContext={chatContext}
            externalDroppedFile={droppedFile}
            onClose={() => setIsChatOpen(false)}
          />
      </div>

      {/* CENTER: Canvas */}
      <div className="flex-1 relative rounded-[32px] overflow-hidden z-10">
         <BubbleGraph 
            memories={memories} 
            selectedId={selectedMemory?.id || null}
            onSelectMemory={(mem) => {
                setSelectedMemory(mem);
                // Don't auto open chat, let user decide
            }} 
         />
         
         {/* Drag Overlay Indicator */}
         {isDragging && (
            <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-blue-600 animate-in fade-in duration-200 rounded-[32px] border-4 border-blue-400 border-dashed m-4">
                <ImageIcon size={64} className="mb-6 animate-bounce" />
                <p className="font-semibold text-2xl">Drop image to create Memory</p>
                <p className="text-lg opacity-70 mt-2">Pickle will extract EXIF data & visual context</p>
            </div>
         )}
      </div>

      {/* CONTROLS: Floating Bar */}
      <div 
        className={`fixed top-6 z-20 flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ right: selectedMemory ? '520px' : '24px' }} 
      >
         <div className="glass-panel p-2 rounded-2xl shadow-sm flex flex-col gap-2 bg-white/90 backdrop-blur-md border border-white/50">
            <button 
                onClick={() => setShowIntegrations(true)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 text-gray-500 transition-colors" 
                title="Integrations"
            >
                <LayoutGrid size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 text-gray-500 transition-colors" title="Saved">
                <Disc size={20} />
            </button>
             <button 
                onClick={() => setIsChatOpen(true)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isChatOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-black/5 text-gray-500'}`} 
                title="Chat"
            >
                <Plus size={20} className={isChatOpen ? 'rotate-45 transition-transform' : ''} />
            </button>
            <div className="h-px w-6 bg-gray-200 mx-auto my-1"></div>
             <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 text-gray-500 transition-colors" title="Center View">
                <Target size={20} />
            </button>
         </div>

         <div className="glass-panel p-2 rounded-2xl shadow-sm flex flex-col gap-2 mt-auto bg-white/90 backdrop-blur-md border border-white/50">
             <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 text-gray-500 transition-colors" title="Settings">
                <Settings size={20} />
            </button>
         </div>
      </div>

      {/* RIGHT: Memory Detail Panel */}
      <div 
        className={`fixed top-6 bottom-6 right-6 z-30 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${selectedMemory ? 'translate-x-0' : 'translate-x-[calc(100%+24px)]'}`}
      >
         <div className="h-full w-[480px] rounded-[32px] overflow-hidden shadow-2xl">
            <MemorySidebar 
                memory={selectedMemory} 
                allMemories={memories}
                onClose={() => setSelectedMemory(null)}
                onOpenChat={handleOpenChatWithContext}
            />
         </div>
      </div>

      {/* Integration Modal Overlay */}
      <IntegrationsModal 
        isOpen={showIntegrations} 
        onClose={() => setShowIntegrations(false)}
        integrations={integrations}
        onToggle={toggleIntegration}
      />

    </div>
  );
};

export default App;