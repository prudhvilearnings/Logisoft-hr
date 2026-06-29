import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCommentDots, FaChevronDown, FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa';
import { chatService } from '../../../services/chatService';
import type { ChatMessage } from '../../../services/chatService';

const QUICK_SUGGESTIONS = [
  'How do I request leave?',
  'Who is my team leader?',
  'What is our sprint target?',
];

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Hello! I am your Logisoft HR assistant. Ask me anything about policy details, leaves, sprint goals, or company departments.",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend: string = inputValue) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // 1. Append User Message
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      text: trimmed,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setErrorMsg(null);

    // 2. Query Chatbot Service
    try {
      const responseText = await chatService.sendMessage(trimmed);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        text: responseText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      setErrorMsg('Failed to fetch response. Please verify connection and try again.');
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Safe HTML parser helper to render basic inline Markdown (bold, italics)
   */
  const renderMessageText = (text: string) => {
    // Escape standard characters & translate Markdown syntax
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[360px] md:w-[400px] h-[500px] bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 backdrop-blur-md"
          >
            {/* Header section */}
            <div className="bg-gradient-to-r from-secondary to-primary p-4 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <FaRobot className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight text-white">HR Assistant AI</h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[10px] text-white/70 font-medium">Assistant Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
              >
                <FaChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex flex-col max-w-[80%] space-y-1">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.isBot
                          ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                          : 'bg-gradient-to-r from-secondary to-primary text-white rounded-tr-none'
                      }`}
                    >
                      {renderMessageText(msg.text)}
                    </div>
                    <span className={`text-[8px] text-slate-500 font-semibold px-1 ${
                      msg.isBot ? 'text-left' : 'text-right'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex space-x-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}

              {/* Error boundary alert */}
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-2xl text-[10px] text-red-400 text-center font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Anchor for Auto Scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Pills */}
            <div className="p-3 bg-slate-900/40 border-t border-slate-900/60 flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  disabled={isTyping}
                  onClick={() => handleSend(sug)}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-semibold transition cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Message input footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-900 flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={isTyping}
                placeholder={isTyping ? 'Waiting for assistant...' : 'Ask about leave, sprints, budgets...'}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary disabled:opacity-60 transition"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping}
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-secondary to-primary hover:brightness-110 flex items-center justify-center text-white disabled:opacity-50 transition active:scale-95 cursor-pointer"
              >
                <FaPaperPlane className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-primary text-white shadow-xl shadow-primary/20 flex items-center justify-center hover:brightness-110 transition relative focus:outline-none cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaTimes className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="comment"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaRegCommentDots className="w-6 h-6 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-accent border-2 border-slate-900 rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;
