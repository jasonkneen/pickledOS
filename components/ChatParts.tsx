import React from 'react';
import { BookOpen, Mic, Coffee, FileText, ChevronRight } from 'lucide-react';
import { Memory } from '../types';

interface UserMessageProps {
    text: string;
}
export const UserMessage: React.FC<UserMessageProps> = ({ text }) => (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-gray-100 text-gray-900 px-5 py-4 rounded-2xl rounded-tr-none text-sm max-w-[90%] leading-relaxed shadow-sm">
            {text}
        </div>
    </div>
);

interface AIMessageProps {
    children: React.ReactNode;
}
export const AIMessage: React.FC<AIMessageProps> = ({ children }) => (
    <div className="text-sm text-gray-800 leading-7 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
        {children}
    </div>
);

interface BubbleCountChipProps {
    count: number;
    onClick?: () => void;
}
export const BubbleCountChip: React.FC<BubbleCountChipProps> = ({ count, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors group"
    >
        <span>Reviewed {count} Bubbles</span>
        <ChevronRight size={12} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
    </button>
);

interface MemoryCardProps {
    title: string;
    icon: any;
    colorClass: string;
}
export const MemoryCard: React.FC<MemoryCardProps> = ({ title, icon: Icon, colorClass }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm inline-block min-w-[200px] hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-2 text-xs text-gray-700">
            <Icon size={12} className={colorClass} />
            <span className="font-medium truncate">{title}</span>
        </div>
    </div>
);

interface ThinkingStateProps {
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}
export const ThinkingState: React.FC<ThinkingStateProps> = ({ isExpanded, onToggle, children }) => (
    <div className="space-y-3">
        <button 
            onClick={onToggle}
            className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors select-none"
        >
            <span>Thinking</span>
            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                 <ChevronRight size={12} />
            </div>
        </button>
        
        {isExpanded && (
            <div className="pl-3 border-l-2 border-gray-100 space-y-4 animate-in slide-in-from-left-2 fade-in duration-300">
                {children}
            </div>
        )}
    </div>
);

interface ModelSelectorProps {
    selected: string;
    onSelect: (m: string) => void;
}
export const ModelSelector: React.FC<ModelSelectorProps> = ({ selected, onSelect }) => {
    const models = ['Gemini 2.5 Flash', 'Gemini 3.0 Pro', 'Claude 3.5 Sonnet', 'GPT-4o'];
    
    return (
        <div className="relative group">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium px-2 py-1 rounded-lg hover:bg-gray-200/50 cursor-pointer transition-colors">
                <span>{selected}</span>
                <ChevronRight size={10} className="rotate-90" />
            </div>
            
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                {models.map(m => (
                    <button
                        key={m}
                        onClick={() => onSelect(m)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-gray-50 transition-colors ${selected === m ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    );
};