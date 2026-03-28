import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, BookOpen, MessageSquare } from 'lucide-react';
import './MaterialChat.css';

const API_BASE = 'http://localhost:5000/api';

function formatAnswer(text) {
  // Convert **bold**, bullet points, and newlines to readable HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

export default function MaterialChat({ material, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hi! I've read **"${material.title}"**. Ask me anything about it — concepts, definitions, doubts, summaries — I'm here to help!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/materials/${material._id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setMessages((prev) => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [...prev, { role: 'ai', text: `⚠️ Error: ${err.message}`, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    'Summarize this document',
    'What are the key concepts?',
    'List all important topics',
    'Explain the main idea',
  ];

  return (
    <div className="mchat-overlay" onClick={onClose}>
      <div className="mchat-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mchat-header">
          <div className="mchat-header-left">
            <div className="mchat-icon"><MessageSquare size={18} /></div>
            <div>
              <div className="mchat-title">Chat with Notes</div>
              <div className="mchat-subtitle">
                <BookOpen size={12} /> {material.title}
              </div>
            </div>
          </div>
          <button className="mchat-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Messages */}
        <div className="mchat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`mchat-msg ${msg.role} ${msg.isError ? 'error' : ''}`}>
              <div className="mchat-avatar">
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div
                className="mchat-bubble"
                dangerouslySetInnerHTML={{ __html: `<p>${formatAnswer(msg.text)}</p>` }}
              />
            </div>
          ))}

          {loading && (
            <div className="mchat-msg ai">
              <div className="mchat-avatar"><Bot size={16} /></div>
              <div className="mchat-bubble mchat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="mchat-quick">
            {quickPrompts.map((p) => (
              <button key={p} className="mchat-quick-btn" onClick={() => { setInput(p); inputRef.current?.focus(); }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mchat-input-row">
          <textarea
            ref={inputRef}
            className="mchat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            rows={1}
            disabled={loading}
          />
          <button
            className={`mchat-send ${loading || !input.trim() ? 'disabled' : ''}`}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mchat-footer">Powered by Gemini AI · Answers based on document content only</div>
      </div>
    </div>
  );
}
