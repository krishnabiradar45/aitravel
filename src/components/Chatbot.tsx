import { useState, useRef, useEffect } from 'react';
import { chatbotReply } from '../data/mockAI';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const suggestions = [
  'Best places to visit?',
  'What should I pack?',
  'How much will it cost?',
  'Suggest activities for today',
  'Weather forecast',
  'Hotel recommendations',
];

export default function Chatbot() {
  const { currentItinerary } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      text: 'Hello! I\'m your TravelAI assistant ✈️\n\nAsk me anything about destinations, packing, weather, budget, or itinerary changes!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: text.trim(), time };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const reply = chatbotReply(text, {
        destination: currentItinerary?.destination,
      });
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        role: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setTyping(false);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={`${line === '' ? 'mt-1' : ''}`} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1F3A5F] text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-[#2d5280] transition-all hover:scale-110"
        aria-label="Open AI assistant"
      >
        {open ? '×' : '✈'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-[#1C1E1A] rounded-2xl shadow-2xl border border-[#D4D0C8] dark:border-[#2E302B] flex flex-col overflow-hidden animate-slide-up" style={{ height: 520 }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1F3A5F] text-white flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">✈</div>
            <div>
              <p className="font-semibold text-sm">TravelAI Assistant</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white text-xl">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">✈</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-[#1F3A5F] text-white rounded-br-sm'
                    : 'bg-[#F0EEEA] dark:bg-[#252720] text-[#0D0D0D] dark:text-white rounded-bl-sm'
                  }`}
                >
                  <div className="space-y-0.5">{formatText(msg.text)}</div>
                  <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-[#9A9690]'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-xs mr-2 flex-shrink-0">✈</div>
                <div className="bg-[#F0EEEA] dark:bg-[#252720] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="typing-dot w-2 h-2 rounded-full bg-[#6B6560] dark:bg-[#9A9690] inline-block" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-3 py-2 border-t border-[#D4D0C8] dark:border-[#2E302B] flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
            {suggestions.slice(0, 3).map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full border border-[#D4D0C8] dark:border-[#2E302B] text-[#1F3A5F] dark:text-[#7BAFD4] hover:bg-[#F0EEEA] dark:hover:bg-[#252720] transition-colors whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-1 flex gap-2 flex-shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] bg-[#F0EEEA] dark:bg-[#252720] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-9 h-9 bg-[#1F3A5F] text-white rounded-xl flex items-center justify-center hover:bg-[#2d5280] transition-colors disabled:opacity-40"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
