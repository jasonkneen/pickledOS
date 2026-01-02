import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, analyzeImage } from '../services/geminiService';
import { ChatMessage, Memory } from '../types';
import { ArrowUp, Maximize2, MessageSquare, ChevronDown, ChevronRight, FileText, Mic, BookOpen, Coffee, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { UserMessage, AIMessage, BubbleCountChip, MemoryCard, ThinkingState, ModelSelector } from './ChatParts';

interface ChatPanelProps {
    onAddMemory?: (memory: Memory) => void;
    selectedMemory?: Memory | null;
    initialContext?: { count: number } | null;
    externalDroppedFile?: File | null;
    onClose?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onAddMemory, selectedMemory, initialContext, externalDroppedFile, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]); 
    const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);
    const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Flash');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset/Init when panel opens or context changes
    useEffect(() => {
        if (initialContext) {
            setMessages(prev => [
                ...prev, 
                { 
                    type: 'context-start', 
                    count: initialContext.count,
                    text: `Started conversation with ${initialContext.count} related memories.`
                },
                {
                    type: 'ai',
                    content: <p>I'm reviewing the selected memory and its connections. What would you like to know?</p>
                }
            ]);
        }
    }, [initialContext]);

    // Handle dropped file from App.tsx
    useEffect(() => {
        if (externalDroppedFile) {
            processFile(externalDroppedFile);
        }
    }, [externalDroppedFile]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userText }]);
        setIsProcessing(true);

        try {
             // Simulate thinking for text
            const response = await sendMessageToGemini(userText);
            setMessages(prev => [...prev, { 
                 type: 'ai', 
                 content: <p>{response}</p> 
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { type: 'ai', content: <p>Sorry, I had trouble connecting.</p> }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (imageFile: File) => {
        setIsProcessing(true);
        
        // Optimistic UI update
        setMessages(prev => [...prev, { type: 'user', text: `Uploaded ${imageFile.name}` }]);

        const reader = new FileReader();
        
        reader.onerror = () => {
            setMessages(prev => [...prev, { type: 'ai', content: <p>Error reading file.</p> }]);
            setIsProcessing(false);
        };

        reader.onload = async (event) => {
            try {
                const base64Raw = event.target?.result as string;
                const base64Data = base64Raw.split(',')[1];
                
                // Add thinking steps
                setMessages(prev => [...prev, {
                    type: 'thinking',
                    steps: [
                        { text: "Analyzing EXIF and visual features...", status: 'done' },
                        { text: "Generating description...", status: 'active' }
                    ]
                }]);

                // Call Service
                const analysis = await analyzeImage(base64Data, imageFile.type);
                
                // Create Memory Callback
                if (onAddMemory) {
                    const newMemory: Memory = {
                        id: `mem-upload-${Date.now()}`,
                        title: analysis.title || "New Image Memory",
                        source: 'apple', 
                        date: analysis.date || new Date().toLocaleDateString(),
                        content: analysis.content || "Image analysis completed.",
                        tags: analysis.tags || ['Image'],
                        previewImage: base64Raw,
                        relatedIds: []
                    };
                    onAddMemory(newMemory);

                    // Update UI with success
                    setMessages(prev => {
                        // Remove the active thinking state or mark it complete (simplified here by appending)
                        return [...prev, {
                            type: 'ai',
                            content: (
                                <div>
                                    <p className="mb-2">I've analyzed the photo <span className="font-semibold">{analysis.title}</span> and added it to your graph.</p>
                                    <div className="bg-gray-50 rounded-xl p-3 flex gap-3 items-center border border-gray-100">
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${base64Raw})`}}></div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold truncate">{analysis.title}</p>
                                            <p className="text-[10px] text-gray-500 line-clamp-1">{analysis.content}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }];
                    });
                }
            } catch (error) {
                console.error(error);
                setMessages(prev => [...prev, { type: 'ai', content: <p>I couldn't fully analyze that image, but I've saved it.</p> }]);
            } finally {
                setIsProcessing(false);
            }
        };
        
        reader.readAsDataURL(imageFile);
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
                     {/* Context Indicator */}
                     {selectedMemory && (
                         <div className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full animate-in fade-in">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                             Linked
                         </div>
                     )}
                     {onClose && (
                        <button onClick={onClose} className="hover:text-gray-600 transition-colors">
                            <X size={16} />
                        </button>
                     )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide space-y-8">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="text-sm">Drop an image anywhere to start</p>
                        <p className="text-xs mt-2">or select a memory and click @</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <React.Fragment key={idx}>
                        {msg.type === 'context-start' && (
                             <div className="flex justify-center mb-6">
                                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <FileText size={12} />
                                    <span>{msg.text}</span>
                                </div>
                             </div>
                        )}

                        {msg.type === 'user' && <UserMessage text={msg.text} />}
                        
                        {msg.type === 'thinking' && (
                            <ThinkingState 
                                isExpanded={isThinkingExpanded} 
                                onToggle={() => setIsThinkingExpanded(!isThinkingExpanded)}
                            >
                                {msg.steps.map((step: any, i: number) => (
                                    <React.Fragment key={i}>
                                        {step.type === 'review' ? (
                                            <div className="space-y-2">
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                                                    Reviewing Bubbles · {step.count}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {step.items.map((item: any, j: number) => (
                                                        <MemoryCard 
                                                            key={j}
                                                            title={item.title}
                                                            icon={item.icon}
                                                            colorClass={item.color}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {step.status === 'active' ? (
                                                    <Loader2 size={12} className="animate-spin text-blue-500" />
                                                ) : (
                                                    <span className="w-1 h-4 bg-gray-300 rounded-full"></span>
                                                )}
                                                {step.text}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ThinkingState>
                        )}

                        {msg.type === 'ai' && (
                            <AIMessage>
                                {msg.content}
                            </AIMessage>
                        )}
                    </React.Fragment>
                ))}
                
                {isProcessing && messages[messages.length - 1].type !== 'thinking' && (
                     <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse px-4">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing...</span>
                    </div>
                )}
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
                        disabled={isProcessing}
                    />
                    <div className="flex items-center justify-between px-4 pb-3">
                         <ModelSelector selected={selectedModel} onSelect={setSelectedModel} />
                         
                         <div className="flex items-center gap-3">
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileInput}
                             />
                             <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Upload Image"
                             >
                                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                </div>
                             </button>
                             <button 
                                type="submit"
                                disabled={!input.trim() || isProcessing}
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