'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Button from '@/components/ui/Button';
import EulerMascot from '@/components/mascot/EulerMascot';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function EulerPage() {
  const { user } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUnlocked = user?.ai_agent_unlocked || false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/euler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          conversationId,
        }),
      });

      const data = await response.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I seem to be having connection issues. Please try again in a moment.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Locked state
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-8xl mb-6">🔒</div>
          <h1 className="text-3xl font-extrabold mb-4">Euler&apos;s Mind</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Complete all 20 learning paths to unlock your personal AI mathematician.
            This is the ultimate reward for mastering the Mathly curriculum.
          </p>
          <EulerMascot state="thinking" size="md" message="Complete all paths to unlock me!" />
          <div className="mt-8">
            <Button variant="primary" onClick={() => window.location.href = '/learn'}>
              Continue Learning
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div>
            <h1 className="font-bold">Euler&apos;s Mind</h1>
            <p className="text-xs text-gray-400">Your AI Mathematics Companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-900 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <EulerMascot state="excited" size="lg" />
              <h2 className="text-xl font-bold text-white mt-6 mb-2">
                Welcome to Euler&apos;s Mind
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                You&apos;ve earned access to your personal AI mathematician.
                Ask me about unsolved problems, proofs, or any mathematical concept.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Explain the Riemann Hypothesis',
                  'Why is P vs NP important?',
                  'Walk me through a proof by induction',
                  "What's the Collatz Conjecture?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="bg-gray-800 text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                {message.role === 'assistant' && (
                  <p className="text-xs text-secondary font-bold mb-1">Euler</p>
                )}
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
                <p className="text-xs text-secondary font-bold mb-1">Euler</p>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
            placeholder="Ask Euler anything about mathematics..."
            disabled={loading}
          />
          <Button variant="secondary" onClick={sendMessage} disabled={!input.trim() || loading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
