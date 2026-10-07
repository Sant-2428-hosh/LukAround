import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, X, Send, Sparkles, ChevronDown,
  UtensilsCrossed, RotateCcw, Bot, User, MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  sendChatMessage,
  createTypingAnimator,
  getDefaultSuggestions,
  loadChatHistory,
  saveChatHistory,
  DINING_LOCATIONS
} from '../services/chatEngine';
import ChatResponseCard from './ChatResponseCards';

// ── Dynamic Culinary Greeting message ──────────────────────────────────────────
const createGreeting = (city = 'Jaipur') => ({
  id: 'greeting',
  role: 'assistant',
  text: `Namaste & Bon Appétit! 🍽️ I'm LukAround Dining AI — your personal restaurant & culinary guide. Looking for the best places to eat in ${city}? Ask me for iconic restaurants, famous street food, pure veg spots, rooftop dining, or local delicacies!`,
  type: 'text',
  suggestions: getDefaultSuggestions(city)
});

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
    const initialGreeting = createGreeting(selectedCity || 'Jaipur');
    if (saved.length > 0) {
      setMessages(saved);
      messagesRef.current = saved;
    } else {
      setMessages([initialGreeting]);
      messagesRef.current = [initialGreeting];
    }
    // Stop pulsing after 8s
    const t = setTimeout(() => setPulseActive(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // Sync context city with selected place on website
  useEffect(() => {
    const currentPlace = selectedCity || 'Jaipur';
    setContextCity(currentPlace);
    if (days) setContextDays(days);

    // If chat has only the greeting, update it to the newly selected place
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.id === 'greeting') {
        const fresh = createGreeting(currentPlace);
        messagesRef.current = [fresh];
        return [fresh];
      }
      return prev;
    });
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
    const fresh = [createGreeting(selectedCity || 'Jaipur')];
    messagesRef.current = fresh;
    setMessages(fresh);
    saveChatHistory([]);
    setContextCity(selectedCity || 'Jaipur');
  };

  // Instant Adaptation when user selects a place from quick bar
  const handleSelectLocation = useCallback(async (loc) => {
    if (isLoading) return;
    setContextCity(loc);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(`Top restaurants and iconic food in ${loc}`, [], loc, contextDays);
      const botMsg = {
        id: Date.now(),
        role: 'assistant',
        text: response.text || `Here are the top curated restaurants & dining spots in ${loc}:`,
        type: response.type || 'restaurants',
        data: response.data || null,
        city: loc,
        days: contextDays,
        suggestions: response.suggestions || getDefaultSuggestions(loc),
        _isNew: true
      };
      addMessage(botMsg);
    } catch (err) {
      addMessage({
        id: Date.now(),
        role: 'assistant',
        text: `Here are the top dining spots in ${loc}:`,
        type: 'restaurants',
        city: loc,
        suggestions: getDefaultSuggestions(loc),
        _isNew: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, contextDays, addMessage]);

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'chat-toggle-btn--open' : ''} ${pulseActive && !isOpen ? 'chat-toggle-btn--pulse' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close Dining AI' : 'Open Restaurant & Dining AI'}
      >
        {isOpen ? (
          <ChevronDown size={22} strokeWidth={2.5} />
        ) : (
          <>
            <Sparkles size={20} strokeWidth={2.5} />
            {!isOpen && <span className="chat-toggle-label">FOOD AI</span>}
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
            <div className="chat-header-icon" style={{ background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)' }}>
              <UtensilsCrossed size={16} color="#FFFFFF" />
            </div>
            <div>
              <div className="chat-header-title">LukAround Dining AI</div>
              <div className="chat-header-sub">
                <span className="chat-online-dot" />
                Restaurant & Culinary Guide • {contextCity}
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

        {/* ── Location Quick-Adaptation Bar ── */}
        <div className="chat-location-bar">
          <div className="chat-location-bar-label">
            <MapPin size={11} />
            <span>Places:</span>
          </div>
          <div className="chat-location-chips">
            {DINING_LOCATIONS.map((loc) => {
              const isActive = (contextCity || '').toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  className={`chat-location-pill ${isActive ? 'chat-location-pill--active' : ''}`}
                  onClick={() => handleSelectLocation(loc)}
                  title={`Adapt dining guide to ${loc}`}
                >
                  {loc}
                </button>
              );
            })}
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
            placeholder={`Find best restaurants or food in ${contextCity}… 🍽️`}
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
