import React, { useState, useEffect } from 'react';
import { MOCK_INTEGRATIONS, generateMemories } from './constants';
import { Memory, Integration } from './types';
import BubbleGraph from './components/BubbleGraph';
import IntegrationsModal from './components/IntegrationsModal';
import MemorySidebar from './components/MemorySidebar';
import ChatPanel from './components/ChatPanel';
import { Settings, Plus, LayoutGrid, Disc, Target } from 'lucide-react';

const App: React.FC = () => {
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    // Simulate loading memories
    setMemories(generateMemories(60)); 
  }, []);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  return (
    <div className="w-full h-screen bg-[#e8e9eb] p-6 flex overflow-hidden relative selection:bg-blue-100 selection:text-blue-900 gap-6">
      
      {/* LEFT: Permanent Chat Panel */}
      <div className="z-10 shrink-0">
          <ChatPanel />
      </div>

      {/* CENTER: Canvas */}
      <div className="flex-1 relative rounded-[32px] overflow-hidden">
         <BubbleGraph 
            memories={memories} 
            selectedId={selectedMemory?.id || null}
            onSelectMemory={setSelectedMemory} 
         />
      </div>

      {/* CONTROLS: Floating Bar attached to the layout logic */}
      <div 
        className={`fixed top-6 z-20 flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ right: selectedMemory ? '520px' : '24px' }} // 480px sidebar + gap
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
             <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 text-gray-500 transition-colors" title="Add Memory">
                <Plus size={20} />
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