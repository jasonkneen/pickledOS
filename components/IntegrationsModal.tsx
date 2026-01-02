import React from 'react';
import { Integration } from '../types';
import { ShieldCheck, Lock, Check, Database, Smartphone, Trash2 } from 'lucide-react';

interface IntegrationCardProps {
    app: Integration;
    onToggle: (id: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ app, onToggle }) => (
    <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${app.connected ? 'border-green-100 bg-green-50/30' : 'border-gray-100 bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{app.icon}</span>
                <span className="font-semibold text-gray-900">{app.name}</span>
            </div>
            <button 
                onClick={() => onToggle(app.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    app.connected 
                    ? 'bg-white border border-green-200 text-green-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
                {app.connected ? (
                    <span className="flex items-center gap-1 group-hover:hidden"><Check size={14} /> Active</span>
                ) : 'Load'}
                {app.connected && <span className="hidden group-hover:inline">Disconnect</span>}
            </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-6 min-h-[40px] leading-relaxed">
            {app.description}
        </p>

        <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">✨ Est. bubbles</span>
                <span className="font-medium text-gray-900">{app.stats.estBubbles}</span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">⚡ Load time</span>
                <span className="font-medium text-gray-900">{app.stats.firstBubbleIn}</span>
            </div>
        </div>
    </div>
);

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: Integration[];
  onToggle: (id: string) => void;
  onClearAll: () => void;
  totalMemories: number;
}

const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose, integrations, onToggle, onClearAll, totalMemories }) => {
  if (!isOpen) return null;

  const appIntegrations = integrations.filter(i => i.type === 'app');
  const knowledgeIntegrations = integrations.filter(i => i.type === 'knowledge');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex-shrink-0 bg-white z-10">
            <button 
                onClick={onClose} 
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Memory Services</h2>
            <div className="flex items-center justify-between">
                <p className="text-gray-500 max-w-xl">
                    Connect apps or load curated knowledge packs to populate your graph.
                </p>
                {totalMemories > 0 && (
                    <button 
                        onClick={onClearAll}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors mr-12"
                    >
                        <Trash2 size={16} />
                        Clear {totalMemories} Memories
                    </button>
                )}
            </div>

            {/* Privacy Badge */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 flex items-center gap-4 border border-blue-100">
                <div className="flex -space-x-2">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 z-10">
                        <Lock size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-blue-100">
                        <ShieldCheck size={18} />
                    </div>
                </div>
                <div className="flex-1 ml-2">
                    <h3 className="font-semibold text-gray-900 text-sm">Privacy-First Architecture</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Your data is processed inside an isolated Trusted Execution Environment.
                    </p>
                </div>
                <div className="px-3 py-1 bg-white/80 rounded-md text-xs font-bold text-blue-800 border border-blue-100 shadow-sm">
                    SOC 2
                </div>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-12 scrollbar-hide">
            
            {/* Knowledge Packs Section */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                    <Database size={20} className="text-blue-500" />
                    <h3 className="text-lg font-semibold">Knowledge Packs</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {knowledgeIntegrations.map((app) => (
                        <IntegrationCard key={app.id} app={app} onToggle={onToggle} />
                    ))}
                </div>
            </div>

            {/* Apps Section */}
            <div>
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                    <Smartphone size={20} className="text-purple-500" />
                    <h3 className="text-lg font-semibold">Apps & Services</h3>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appIntegrations.map((app) => (
                        <IntegrationCard key={app.id} app={app} onToggle={onToggle} />
                    ))}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default IntegrationsModal;