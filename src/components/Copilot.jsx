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
    <div className="absolute top-0 right-0 h-full w-88 bg-surface border-l border-border flex flex-col z-50">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-accent/15 flex items-center justify-center">
            <Bot size={15} className="text-indigo-400" />
          </div>
          <span className="font-semibold text-slate-200 text-sm">Retail Copilot</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.5 max-w-[88%]",
              msg.sender === 'user' ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
              msg.sender === 'user'
                ? "bg-indigo-accent/15 text-indigo-400"
                : "bg-surface-light text-slate-400"
            )}>
              {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>
            <div className={cn(
              "p-3 rounded-lg text-xs leading-relaxed border",
              msg.sender === 'user'
                ? "bg-indigo-accent/8 border-indigo-accent/20 text-slate-200"
                : "bg-background border-border text-slate-300"
            )}>
              {msg.message}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 max-w-[88%] self-start">
            <div className="w-7 h-7 rounded-lg bg-surface-light text-slate-400 flex items-center justify-center shrink-0">
              <Bot size={13} />
            </div>
            <div className="p-3 rounded-lg text-xs bg-background border border-border text-slate-500 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" /> Analyzing edge data…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about revenue, queues, or inventory…"
            className="w-full bg-surface border border-border rounded-lg pl-3 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-accent/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
