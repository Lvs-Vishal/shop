import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const Copilot = ({ isOpen, onClose }) => {
  const { data } = useAppContext();
  const [messages, setMessages] = useState(data.chatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', message: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let aiMsg = "I'm analyzing the edge telemetry data. Currently, everything looks stable, but let me know if you need specific insights on inventory or queues.";
      
      if (userMsg.message.toLowerCase().includes("queue")) {
        aiMsg = "Queue intelligence shows Counter 4 is currently experiencing the longest wait time (8.5m). Opening Counter 3 should resolve this within 10 minutes.";
      } else if (userMsg.message.toLowerCase().includes("revenue")) {
        aiMsg = "You currently have ₹45,200 recovered today. However, there's ₹17,800 at risk due to out-of-stock items, primarily Organic Bananas.";
      }

      setMessages(prev => [...prev, { sender: 'copilot', message: aiMsg }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-surface border-l border-border shadow-2xl flex flex-col z-50 transform transition-transform duration-300">
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-cyan-accent" />
          <span className="font-bold text-white tracking-wide">Retail Copilot</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-3 max-w-[85%]",
            msg.sender === 'user' ? "self-end flex-row-reverse" : "self-start"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.sender === 'user' ? "bg-cyan-accent/20 text-cyan-accent" : "bg-white/10 text-gray-300"
            )}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn(
              "p-3 rounded-lg text-sm",
              msg.sender === 'user' ? "bg-cyan-accent/10 border border-cyan-accent/20 text-gray-200" : "bg-background border border-border text-gray-300"
            )}>
              {msg.message}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="w-8 h-8 rounded-full bg-white/10 text-gray-300 flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="p-3 rounded-lg text-sm bg-background border border-border text-gray-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Analyzing edge data...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-background/50">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about revenue, queues, or inventory..."
            className="w-full bg-surface border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-accent/50 focus:ring-1 focus:ring-cyan-accent/50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-cyan-accent disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
