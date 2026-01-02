import React from 'react';
import { Integration } from '../types';
import { ShieldCheck, Lock, Check } from 'lucide-react';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: Integration[];
  onToggle: (id: string) => void;
}

const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose, integrations, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4">
            <button 
                onClick={onClose} 
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-800 transition-colors"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Let’s bring all your scattered memories into single place</h2>
            <p className="text-gray-500 mb-8 max-w-2xl">
                When you connect your apps, we will process raw datas and extract essential memories and turn it into bubbles.
            </p>

            {/* Privacy Badge */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    SOC 2
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-inner">
                    <Lock size={20} />
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-inner">
                    <ShieldCheck size={20} />
                </div>
                <div className="flex-1 ml-2">
                    <h3 className="font-medium text-gray-900">We care deeply about your privacy.</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Your data is stored in an encrypted form and processed inside an isolated Trusted Execution Environment. 
                        No one can access your data. Not us, not any attacker.
                    </p>
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Learn more
                </button>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Sources</h3>
        </div>

        {/* Grid of Cards */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app) => (
                    <div key={app.id} className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{app.icon}</span>
                                <span className="font-semibold text-gray-900">{app.name}</span>
                            </div>
                            <button 
                                onClick={() => onToggle(app.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    app.connected 
                                    ? 'bg-gray-100 text-green-600 pl-3 pr-4 flex items-center gap-1' 
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            >
                                {app.connected && <Check size={14} />}
                                {app.connected ? '' : 'Connect'}
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6 min-h-[40px] leading-relaxed">
                            {app.description}
                        </p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1">✨ Est. bubbles</span>
                                <span className="font-medium text-gray-900">{app.stats.estBubbles}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1">⚡ First bubble in</span>
                                <span className="font-medium text-gray-900">{app.stats.firstBubbleIn}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1">⌛ Total duration</span>
                                <span className="font-medium text-gray-900">{app.stats.totalDuration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default IntegrationsModal;
