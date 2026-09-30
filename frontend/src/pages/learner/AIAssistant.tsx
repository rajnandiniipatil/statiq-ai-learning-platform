import React, { useState, useRef, useEffect } from 'react';
import { aiApi } from '../../api/client';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  sourceReferences?: string[];
  suggestedFollowUps?: string[];
  relevantCompetencies?: string[];
  timestamp: string;
}

const STARTER_PROMPTS = [
  'Explain Multistage Stratified Sampling in NSSO household surveys',
  'How does the Consumer Price Index (CPI) basket weighting work in India?',
  'What is the formula and intuition for ratio estimator variance?',
  'How do I calculate GDP at basic prices vs market prices in National Accounts?',
];

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'AI',
      text: 'Namaste! I am StatIQ AI, your statistical learning assistant trained on Indian Official Statistics methodologies, NSSO sampling guides, and National Accounts frameworks. How can I assist your statistical capacity building today?',
      sourceReferences: ['MoSPI Official Statistical System Documentation', 'NSSO 78th Round Methodology'],
      suggestedFollowUps: [
        'Explain Multistage Stratified Sampling in NSSO',
        'How does CPI basket weighting work?',
      ],
      relevantCompetencies: ['Survey Design', 'Sampling', 'National Accounts'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Official Statistics');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await aiApi.askAssistant({
        query: textToSend,
        contextTopic: selectedTopic,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: response.answer,
        sourceReferences: response.sourceReferences,
        suggestedFollowUps: response.suggestedFollowUps,
        relevantCompetencies: response.relevantCompetencies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error contacting AI Assistant', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: 'I apologize, but I encountered an issue processing your query through the statistical reasoning service. In general official statistical surveys utilize multistage stratified probability proportional to size (PPS) sampling to guarantee precision across sub-state domains.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gov-blue to-gov-navy text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900">StatIQ AI Statistical Assistant</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Online &bull; MoSPI Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive pedagogical assistance across official methodologies, sampling calculations, and SDG metrics.
            </p>
          </div>
        </div>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-gov-blue"
        >
          <option value="Official Statistics">All Official Statistics</option>
          <option value="Sampling & Survey Design">Sampling & Survey Design</option>
          <option value="National Accounts">National Accounts</option>
          <option value="Price Statistics">Price Statistics (CPI/WPI)</option>
          <option value="Python & Data Science">Python & Data Analytics</option>
        </select>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'USER';

          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                  isUser ? 'bg-gov-navy text-white' : 'bg-gov-blue text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-2 max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gov-blue text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>

                {/* AI Metadata: Source References & Competencies */}
                {!isUser && (m.sourceReferences || m.relevantCompetencies) && (
                  <div className="bg-indigo-50/60 border border-indigo-100 p-3 rounded-xl text-left space-y-2 text-[11px]">
                    {m.sourceReferences && m.sourceReferences.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700 block mb-0.5">Authoritative References:</span>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {m.sourceReferences.map((ref, idx) => (
                            <li key={idx}>{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.relevantCompetencies && m.relevantCompetencies.length > 0 && (
                      <div className="flex items-center space-x-1 pt-1">
                        <span className="font-semibold text-slate-700">Mappable Competency:</span>
                        {m.relevantCompetencies.map((comp, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-indigo-200 text-gov-blue px-2 py-0.5 rounded font-medium"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Follow-up suggestions */}
                {!isUser && m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 text-left">
                    {m.suggestedFollowUps.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors flex items-center"
                      >
                        <ChevronRight className="w-3 h-3 mr-1 text-gov-blue" />
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">{m.timestamp}</span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gov-blue text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-none space-y-2">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-gov-blue animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gov-blue animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-gov-blue animate-bounce [animation-delay:0.4s]"></div>
                <span>Analyzing statistical manuals...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 flex-shrink-0">
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] whitespace-nowrap bg-white border border-slate-200 hover:border-gov-blue text-slate-600 hover:text-gov-blue px-3 py-1.5 rounded-lg shadow-2xl transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 flex-shrink-0"
      >
        <input
          type="text"
          placeholder="Ask anything about official statistics methodologies, sampling formulas, or national data systems..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 text-xs focus:outline-none text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-40"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
