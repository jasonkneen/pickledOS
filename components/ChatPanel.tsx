import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ArrowUp, Maximize2, MessageSquare, ChevronDown, ChevronRight, FileText, Mic, BookOpen, Coffee } from 'lucide-react';

const ChatPanel: React.FC = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        // Mock implementation for demo visual consistency
        setInput('');
    };

    return (
        <div className="w-[420px] h-full flex flex-col bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden border border-white/50 ring-1 ring-black/5">
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                         <MessageSquare size={16} className="text-gray-600" />
                    </div>
                </div>
                <div className="flex gap-3 text-gray-400">
                    <span className="text-xs font-mono mt-1">10:42 AM</span>
                    <button className="hover:text-gray-600 transition-colors">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide space-y-8">
                
                {/* User Message */}
                <div className="flex justify-end">
                    <div className="bg-gray-100 text-gray-900 px-5 py-4 rounded-2xl rounded-tr-none text-sm max-w-[90%] leading-relaxed shadow-sm">
                        I want to write an essay on 'Digital Detox.' Can you pull together my scattered notes on this?
                    </div>
                </div>

                {/* Thinking Process Block */}
                <div className="space-y-3">
                    <button 
                        onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                        className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <span>Thinking</span>
                        {isThinkingExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                    
                    {isThinkingExpanded && (
                        <div className="pl-3 border-l-2 border-gray-100 space-y-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse">
                                <span className="w-1 h-4 bg-gray-400 rounded-full"></span>
                                Gathering fragmented ideas and quotes...
                            </div>
                            
                            {/* Reviewed Bubbles Card */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Reviewing Bubbles · 2</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-700">
                                        <BookOpen size={12} className="text-orange-500" />
                                        <span className="truncate font-medium">Highlighted quote from 'Dopamine Nation'</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-700">
                                        <Mic size={12} className="text-blue-500" />
                                        <span className="truncate font-medium">experience in subway</span>
                                    </div>
                                </div>
                            </div>

                             <div className="text-[10px] uppercase tracking-wider text-green-600 font-semibold flex items-center gap-1">
                                Finished <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                             </div>
                        </div>
                    )}
                </div>

                {/* AI Response */}
                <div className="space-y-4">
                     {/* Summary Card */}
                     <button className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors">
                        <span>Reviewed 2 Bubbles</span>
                        <ChevronRight size={12} />
                     </button>

                     <div className="text-sm text-gray-800 leading-7">
                        <p className="mb-4">
                            I've organized your thoughts under the theme: <span className="font-semibold">'Three Days Logged Out: Reclaiming Autonomy'</span>.
                        </p>
                        <p className="mb-4">
                            The structure starts with the anxiety you felt on the subway (Voice Note), moves into the analysis of dopamine addiction (Reading), and concludes with the freedom you felt in your dream.
                        </p>
                        <p>
                            Using your memo <span className="italic">"Is it a tool or a shackle?"</span> works great as the subtitle.
                        </p>
                     </div>

                     <div className="flex gap-2">
                         <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-100">
                            <FileText size={12} />
                            <div className="flex -space-x-1.5">
                                <div className="w-4 h-4 rounded-full bg-orange-100 border border-white"></div>
                                <div className="w-4 h-4 rounded-full bg-blue-100 border border-white"></div>
                            </div>
                            <span>6 Bubbles</span>
                         </div>
                     </div>
                </div>

                {/* User Follow up */}
                 <div className="flex justify-end">
                    <div className="bg-gray-100 text-gray-900 px-5 py-4 rounded-2xl rounded-tr-none text-sm max-w-[90%] leading-relaxed shadow-sm">
                        I love the dream connection. Can you also add that conversation about 'anxiety' I had with my friend at the cafe?
                    </div>
                </div>

                 {/* Thinking 2 */}
                 <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Reviewing Bubbles · 1</div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm inline-block min-w-[200px]">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Coffee size={12} className="text-brown-500" />
                            <span className="font-medium">Recap of coffee with Sarah</span>
                        </div>
                    </div>
                 </div>

                 {/* Final Response */}
                 <div className="text-sm text-gray-800 leading-7 pb-4">
                    <p className="mb-2">
                        Got it. You mean the conversation with Sarah about the <span className="font-semibold">'Comparison Loop,'</span> right?
                    </p>
                    <p>
                         I found your voice note from October 12th where you mentioned, <span className="italic">"Seeing everyone's highlights makes me feel like I'm standing still."</span>
                    </p>
                 </div>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 pt-2 bg-white">
                <form 
                    onSubmit={handleSend}
                    className="relative flex flex-col bg-gray-50 rounded-[24px] border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all shadow-inner"
                >
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Talk to your memory"
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 px-5 pt-4 pb-2"
                    />
                    <div className="flex items-center justify-between px-4 pb-3">
                         <div className="flex items-center gap-2 text-xs text-gray-400 font-medium px-2 py-1 rounded-lg hover:bg-gray-200/50 cursor-pointer transition-colors">
                             <span>Opus 4.5 Thinking</span>
                             <ChevronDown size={10} />
                         </div>
                         <div className="flex items-center gap-3">
                             <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                </div>
                             </button>
                             <button 
                                type="submit"
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    input.trim() 
                                    ? 'bg-black text-white hover:bg-gray-800' 
                                    : 'bg-gray-300 text-white'
                                }`}
                            >
                                <ArrowUp size={16} />
                            </button>
                         </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatPanel;