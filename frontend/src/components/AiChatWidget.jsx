import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, X, Send, Sparkles, ChevronDown,
  Compass, RotateCcw, Bot, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  sendChatMessage,
  createTypingAnimator,
  getDefaultSuggestions,
  loadChatHistory,
  saveChatHistory
} from '../services/chatEngine';
import ChatResponseCard from './ChatResponseCards';

// ── Greeting message ──────────────────────────────────────────────────────────
const GREETING = {
  id: 'greeting',
  role: 'assistant',
  text: "Namaste! 🙏 I'm LukAround AI — your personal India travel expert. Tell me where you'd like to go and I'll craft the perfect trip for you!",
  type: 'text',
  suggestions: [
    '🏰 Plan 3 days in Jaipur',
    '🌴 Best beaches in Goa',
    '🛕 Spiritual trip to Varanasi',
    '🍃 Hill stations near Chennai',
    '💰 Budget trip ideas'
  ]
};

// ── Single message bubble ─────────────────────────────────────────────────────
function ChatMessage({ msg, isNew }) {
  const isBot = msg.role === 'assistant';
  const [displayed, setDisplayed] = useState(isNew && isBot ? '' : msg.text);
  const [done, setDone] = useState(!isNew || !isBot);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!isNew || !isBot || !msg.text) return;
    const cleanup = createTypingAnimator(
      msg.text,
      (current) => setDisplayed(current),
      () => setDone(true),
      22
    );
    cleanupRef.current = cleanup;
    return cleanup;
  }, [msg.text, isNew, isBot]);

  return (
    <div className={`chat-msg-row ${isBot ? 'chat-msg-bot' : 'chat-msg-user'}`}>
      {isBot && (
        <div className="chat-avatar chat-avatar-bot">
          <Bot size={14} />
        </div>
      )}

      <div className="chat-bubble-wrap">
        {/* Text bubble */}
        <div className={`chat-bubble ${isBot ? 'chat-bubble-bot' : 'chat-bubble-user'}`}>
          {displayed}
          {isBot && !done && <span className="chat-cursor">▌</span>}
        </div>

        {/* Rich card — only shown after typing done */}
        {isBot && done && msg.type && msg.type !== 'text' && msg.data && (
          <div className="chat-card-wrapper">
            <ChatResponseCard
              type={msg.type}
              data={msg.data}
              city={msg.city}
              days={msg.days}
              compact
            />
          </div>
        )}

        {/* Suggestion chips — only on last bot message */}
        {isBot && done && msg.suggestions?.length > 0 && (
          <div className="chat-chips">
            {msg.suggestions.map((s, i) => (
              <button key={i} className="chat-chip" data-suggestion={s}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isBot && (
        <div className="chat-avatar chat-avatar-user">
          <User size={14} />
        </div>
      )}
    </div>
  );
}

// ── Loading animation ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="chat-msg-row chat-msg-bot">
      <div className="chat-avatar chat-avatar-bot">
        <Bot size={14} />
      </div>
      <div className="chat-bubble chat-bubble-bot chat-typing-indicator">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────
export default function AiChatWidget() {
  const { selectedCity, days } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextCity, setContextCity] = useState(selectedCity || 'Jaipur');
  const [contextDays, setContextDays] = useState(days || 3);
  const [pulseActive, setPulseActive] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef([]);

  // Initialize from session storage
  useEffect(() => {
    const saved = loadChatHistory();
    if (saved.length > 0) {
      setMessages(saved);
      messagesRef.current = saved;
    } else {
      setMessages([GREETING]);
      messagesRef.current = [GREETING];
    }
    // Stop pulsing after 8s
    const t = setTimeout(() => setPulseActive(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // Sync context city with app
  useEffect(() => {
    if (selectedCity) setContextCity(selectedCity);
    if (days) setContextDays(days);
  }, [selectedCity, days]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const addMessage = useCallback((msg) => {
    const updated = [...messagesRef.current, msg];
    messagesRef.current = updated;
    setMessages([...updated]);
    saveChatHistory(updated);
    return updated;
  }, []);

  const handleSend = useCallback(async (textOverride) => {
    const text = (textOverride || inputText).trim();
    if (!text || isLoading) return;
    setInputText('');

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', text, type: 'text' };
    const historyWithUser = addMessage(userMsg);
    setIsLoading(true);

    try {
      // Build history context (last 8 messages, exclude GREETING)
      const history = historyWithUser
        .filter(m => m.id !== 'greeting')
        .slice(-8)
        .map(m => ({ role: m.role, content: m.text }));

      const response = await sendChatMessage(text, history, contextCity, contextDays);

      // Update context city if the response has one
      if (response.city && response.city !== contextCity) {
        setContextCity(response.city);
      }
      if (response.days) setContextDays(response.days);

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.text || 'Here you go!',
        type: response.type || 'text',
        data: response.data || null,
        city: response.city || contextCity,
        days: response.days || contextDays,
        suggestions: response.suggestions || getDefaultSuggestions(response.city || contextCity),
        _isNew: true
      };
      addMessage(botMsg);
    } catch (err) {
      addMessage({
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Oops! Something went wrong. Please try again.',
        type: 'text',
        suggestions: getDefaultSuggestions(contextCity),
        _isNew: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, contextCity, contextDays, addMessage]);

  // Handle suggestion chip clicks via event delegation
  const handleContainerClick = useCallback((e) => {
    const chip = e.target.closest('[data-suggestion]');
    if (chip) {
      const text = chip.dataset.suggestion;
      setInputText(text);
      handleSend(text);
    }
  }, [handleSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    const fresh = [GREETING];
    messagesRef.current = fresh;
    setMessages(fresh);
    saveChatHistory([]);
    setContextCity(selectedCity || 'Jaipur');
  };

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'chat-toggle-btn--open' : ''} ${pulseActive && !isOpen ? 'chat-toggle-btn--pulse' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close AI Chat' : 'Open AI Travel Assistant'}
      >
        {isOpen ? (
          <ChevronDown size={22} strokeWidth={2.5} />
        ) : (
          <>
            <Sparkles size={20} strokeWidth={2.5} />
            {!isOpen && <span className="chat-toggle-label">AI</span>}
          </>
        )}
        {!isOpen && messages.length > 1 && (
          <span className="chat-unread-dot" />
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div className={`chat-panel ${isOpen ? 'chat-panel--open' : ''}`}>
        {/* Header */}
        <div className="chat-panel-header">
          <div className="chat-panel-header-left">
            <div className="chat-header-icon">
              <Compass size={16} />
            </div>
            <div>
              <div className="chat-header-title">LukAround AI</div>
              <div className="chat-header-sub">
                <span className="chat-online-dot" />
                India Travel Expert
              </div>
            </div>
          </div>
          <div className="chat-panel-header-actions">
            <button className="chat-header-btn" onClick={clearHistory} title="Clear conversation">
              <RotateCcw size={14} />
            </button>
            <button className="chat-header-btn" onClick={() => setIsOpen(false)} title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages-area" onClick={handleContainerClick}>
          {messages.map((msg, i) => (
            <ChatMessage
              key={msg.id || i}
              msg={msg}
              isNew={msg._isNew && i === messages.length - 1}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about any Indian city… ✈️"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={300}
          />
          <button
            className={`chat-send-btn ${inputText.trim() ? 'chat-send-btn--active' : ''}`}
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="chat-input-hint">Press Enter to send · Shift+Enter for new line</div>
      </div>
    </>
  );
}
