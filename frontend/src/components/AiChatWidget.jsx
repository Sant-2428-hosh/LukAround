import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Send, Sparkles, ChevronDown, Plus,
  User, MapPin, Mic, MicOff, History,
  Trash2, Copy, Check, MessageSquare,
  Clock, ArrowRight, RefreshCw, Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoMark from '../assets/logo-mark.png';
import {
  sendChatMessage,
  createTypingAnimator,
  getDefaultSuggestions,
  loadChatHistory,
  saveChatHistory,
  loadDishlySessions,
  saveDishlySessions,
  getActiveSessionId,
  setActiveSessionId,
  DINING_LOCATIONS
} from '../services/chatEngine';
import ChatResponseCard from './ChatResponseCards';

// ── Dynamic Culinary Greeting message ──────────────────────────────────────────
const createGreeting = (city = 'Jaipur') => ({
  id: 'greeting',
  role: 'assistant',
  text: `Namaste & Bon Appétit! 🍽️ I'm Dishly — your personal LukAround culinary & dining concierge. Looking for the best places to eat in ${city}? Ask me for iconic restaurants, famous street food, pure veg spots, rooftop dining, or local delicacies!`,
  type: 'text',
  suggestions: getDefaultSuggestions(city)
});

// ── Format Session Timestamp Helper ───────────────────────────────────────────
function formatSessionDate(timestamp) {
  if (!timestamp) return 'Recently';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today, ${timeStr}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

// ── Single Message Bubble ─────────────────────────────────────────────────────
function ChatMessage({ msg, isNew, onSelectSuggestion }) {
  const isBot = msg.role === 'assistant';
  const [displayed, setDisplayed] = useState(isNew && isBot ? '' : msg.text);
  const [done, setDone] = useState(!isNew || !isBot);
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    if (!msg.text) return;
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`chat-msg-row ${isBot ? 'chat-msg-bot' : 'chat-msg-user'}`}>
      {isBot && (
        <div className="chat-avatar chat-avatar-bot dishly-bot-avatar" title="Dishly AI">
          <img src={logoMark} alt="Dishly AI" className="dishly-avatar-logo" />
        </div>
      )}

      <div className="chat-bubble-wrap">
        {/* Text bubble */}
        <div className={`chat-bubble ${isBot ? 'chat-bubble-bot' : 'chat-bubble-user'}`}>
          <div className="chat-bubble-content">
            {displayed}
            {isBot && !done && <span className="chat-cursor">▌</span>}
          </div>

          {/* Copy action for bot messages */}
          {isBot && done && msg.text && msg.id !== 'greeting' && (
            <button
              type="button"
              className="chat-copy-btn"
              onClick={handleCopy}
              title={copied ? "Copied to clipboard!" : "Copy response"}
              aria-label="Copy text"
            >
              {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
            </button>
          )}
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

        {/* Suggestion chips */}
        {isBot && done && msg.suggestions?.length > 0 && (
          <div className="chat-chips">
            {msg.suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="chat-chip"
                onClick={() => onSelectSuggestion && onSelectSuggestion(s)}
              >
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
      <div className="chat-avatar chat-avatar-bot dishly-bot-avatar">
        <img src={logoMark} alt="Dishly AI" className="dishly-avatar-logo" />
      </div>
      <div className="chat-bubble chat-bubble-bot chat-typing-indicator">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ── Main Dishly Widget ────────────────────────────────────────────────────────
export default function AiChatWidget() {
  const { selectedCity, days, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextCity, setContextCity] = useState(selectedCity || 'Jaipur');
  const [contextDays, setContextDays] = useState(days || 3);
  const [pulseActive, setPulseActive] = useState(true);
  
  // History Drawer State
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Speech Recognition (Microphone) State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef([]);

  // ── Speech Recognition Setup ─────────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputText(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.warn('[Dishly Mic] Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            if (showToast) showToast('Microphone access was denied. Please allow mic permissions in your browser.', 'error');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('[Dishly Mic] Initialization error:', err);
      }
    }
  }, [showToast]);

  const toggleListening = () => {
    if (!speechSupported) {
      if (showToast) {
        showToast('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.', 'error');
      } else {
        alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      }
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start recognition:', err);
        setIsListening(false);
      }
    }
  };

  // ── Load Sessions & Current Chat on Mount ────────────────────────────────────
  useEffect(() => {
    const loadedSessions = loadDishlySessions();
    setSessions(loadedSessions);

    const activeId = getActiveSessionId();
    let initialSession = null;

    if (activeId && loadedSessions.length > 0) {
      initialSession = loadedSessions.find(s => s.id === activeId);
    }

    if (initialSession && initialSession.messages?.length > 0) {
      setCurrentSessionId(initialSession.id);
      setMessages(initialSession.messages);
      messagesRef.current = initialSession.messages;
      if (initialSession.city) setContextCity(initialSession.city);
    } else {
      // Check legacy single-session storage
      const legacy = loadChatHistory();
      const freshGreeting = createGreeting(selectedCity || 'Jaipur');
      const startMsgs = legacy.length > 0 ? legacy : [freshGreeting];
      const newSessionId = `dishly_${Date.now()}`;

      setCurrentSessionId(newSessionId);
      setActiveSessionId(newSessionId);
      setMessages(startMsgs);
      messagesRef.current = startMsgs;
    }

    // Stop launcher pulsing after 8 seconds
    const t = setTimeout(() => setPulseActive(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // ── Sync Context City from Global App Selection ──────────────────────────────
  useEffect(() => {
    const currentPlace = selectedCity || 'Jaipur';
    setContextCity(currentPlace);
    if (days) setContextDays(days);

    // If chat only has default greeting, update to newly picked place
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.id === 'greeting') {
        const fresh = createGreeting(currentPlace);
        messagesRef.current = [fresh];
        return [fresh];
      }
      return prev;
    });
  }, [selectedCity, days]);

  // ── Scroll to Bottom on Message Updates ──────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Focus Input on Open ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // ── Save Current Session into Sessions List & Storage ────────────────────────
  const persistSessionMessages = useCallback((updatedMsgs, cityToUse = contextCity) => {
    const activeId = currentSessionId || `dishly_${Date.now()}`;
    if (!currentSessionId) {
      setCurrentSessionId(activeId);
      setActiveSessionId(activeId);
    }

    // Determine session title from first user query
    const firstUser = updatedMsgs.find(m => m.role === 'user');
    const rawTitle = firstUser ? firstUser.text : `Dining in ${cityToUse}`;
    const sessionTitle = rawTitle.length > 36 ? rawTitle.slice(0, 36) + '…' : rawTitle;

    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === activeId);
      const sessionObj = {
        id: activeId,
        title: sessionTitle,
        city: cityToUse,
        timestamp: Date.now(),
        messages: updatedMsgs
      };

      let nextSessions;
      if (existingIdx >= 0) {
        nextSessions = [...prev];
        nextSessions[existingIdx] = sessionObj;
      } else {
        nextSessions = [sessionObj, ...prev];
      }

      saveDishlySessions(nextSessions);
      return nextSessions;
    });

    saveChatHistory(updatedMsgs);
  }, [currentSessionId, contextCity]);

  // ── Add Message Helper ───────────────────────────────────────────────────────
  const addMessage = useCallback((msg, cityOverride) => {
    const updated = [...messagesRef.current, msg];
    messagesRef.current = updated;
    setMessages([...updated]);
    persistSessionMessages(updated, cityOverride || contextCity);
    return updated;
  }, [contextCity, persistSessionMessages]);

  // ── Send Message ─────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (textOverride) => {
    const text = (textOverride || inputText).trim();
    if (!text || isLoading) return;
    setInputText('');

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', text, type: 'text' };
    const historyWithUser = addMessage(userMsg);
    setIsLoading(true);

    try {
      // 2. Build history payload (last 8 messages)
      const historyPayload = historyWithUser
        .filter(m => m.id !== 'greeting')
        .slice(-8)
        .map(m => ({ role: m.role, content: m.text }));

      const response = await sendChatMessage(text, historyPayload, contextCity, contextDays);

      const targetCity = response.city || contextCity;
      if (response.city && response.city !== contextCity) {
        setContextCity(response.city);
      }
      if (response.days) setContextDays(response.days);

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.text || 'Here are the best recommendations from Dishly!',
        type: response.type || 'text',
        data: response.data || null,
        city: targetCity,
        days: response.days || contextDays,
        suggestions: response.suggestions || getDefaultSuggestions(targetCity),
        _isNew: true
      };
      addMessage(botMsg, targetCity);
    } catch (err) {
      addMessage({
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Oops! Dishly ran into a connection hiccup. Please try again.',
        type: 'text',
        suggestions: getDefaultSuggestions(contextCity),
        _isNew: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, isListening, contextCity, contextDays, addMessage]);

  // ── Start a Fresh New Chat Session ───────────────────────────────────────────
  const handleStartNewChat = () => {
    const newSessionId = `dishly_${Date.now()}`;
    const freshGreeting = createGreeting(contextCity);
    
    setCurrentSessionId(newSessionId);
    setActiveSessionId(newSessionId);
    messagesRef.current = [freshGreeting];
    setMessages([freshGreeting]);
    saveChatHistory([freshGreeting]);
    setShowHistory(false);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // ── Switch to a Past Saved Session ───────────────────────────────────────────
  const handleSelectSession = (session) => {
    setCurrentSessionId(session.id);
    setActiveSessionId(session.id);
    messagesRef.current = session.messages || [];
    setMessages(session.messages || []);
    if (session.city) setContextCity(session.city);
    saveChatHistory(session.messages || []);
    setShowHistory(false);
  };

  // ── Delete a Single Session ──────────────────────────────────────────────────
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    saveDishlySessions(filtered);

    // If active session was deleted, start fresh
    if (currentSessionId === sessionId) {
      handleStartNewChat();
    }
  };

  // ── Clear All Sessions ───────────────────────────────────────────────────────
  const handleClearAllHistory = () => {
    setSessions([]);
    saveDishlySessions([]);
    handleStartNewChat();
  };

  // ── Instant City Adaptation Pill ─────────────────────────────────────────────
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
      addMessage(botMsg, loc);
    } catch (err) {
      addMessage({
        id: Date.now(),
        role: 'assistant',
        text: `Here are the top dining spots in ${loc}:`,
        type: 'restaurants',
        city: loc,
        suggestions: getDefaultSuggestions(loc),
        _isNew: true
      }, loc);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, contextDays, addMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        type="button"
        className={`dishly-toggle-btn ${isOpen ? 'dishly-toggle-btn--open' : ''} ${pulseActive && !isOpen ? 'dishly-toggle-btn--pulse' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close Dishly' : 'Open Dishly — LukAround Food AI'}
        title="Dishly — LukAround Food & Dining AI"
      >
        {isOpen ? (
          <ChevronDown size={24} strokeWidth={2.6} color="#FFFFFF" />
        ) : (
          <div className="dishly-toggle-inner">
            <div className="dishly-toggle-logo-ring">
              <img src={logoMark} alt="LukAround Logo" className="dishly-toggle-logo" />
            </div>
            <div className="dishly-toggle-text-wrap">
              <span className="dishly-toggle-title">Dishly</span>
              <span className="dishly-toggle-tag">FOOD AI</span>
            </div>
            <Sparkles size={13} className="dishly-toggle-sparkle" />
          </div>
        )}
        {!isOpen && messages.length > 1 && (
          <span className="dishly-unread-dot" />
        )}
      </button>

      {/* ── Dishly Chat Panel ── */}
      <div className={`chat-panel dishly-panel ${isOpen ? 'chat-panel--open' : ''}`}>
        
        {/* ── Header ── */}
        <div className="chat-panel-header dishly-header">
          <div className="chat-panel-header-left dishly-header-left">
            {/* Branded LukAround Logo Box */}
            <div className="dishly-logo-badge" title="Powered by LukAround">
              <img src={logoMark} alt="LukAround" className="dishly-header-logo-img" />
              <span className="dishly-online-beacon" />
            </div>
            <div>
              <div className="dishly-title-row">
                <span className="dishly-brand-name">Dishly</span>
                <span className="dishly-ai-badge">AI FOOD GUIDE</span>
              </div>
              <div className="chat-header-sub dishly-sub">
                <span className="chat-online-dot" />
                <span>LukAround Culinary Concierge • <strong>{contextCity}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons: History, New Chat, Close (Visible Cross) */}
          <div className="chat-panel-header-actions dishly-header-actions">
            {/* History Toggle Button */}
            <button
              type="button"
              className={`chat-header-btn dishly-action-btn ${showHistory ? 'dishly-action-btn--active' : ''}`}
              onClick={() => setShowHistory(prev => !prev)}
              title={showHistory ? "Back to Chat" : "View Chat History"}
              aria-label="View Chat History"
            >
              <History size={15} strokeWidth={2.4} color="#FFFFFF" />
              {sessions.length > 0 && (
                <span className="dishly-history-badge">{sessions.length}</span>
              )}
            </button>

            {/* Start New Chat Button */}
            <button
              type="button"
              className="chat-header-btn dishly-action-btn"
              onClick={handleStartNewChat}
              title="Start New Chat Conversation"
              aria-label="Start New Chat"
            >
              <Plus size={16} strokeWidth={2.6} color="#FFFFFF" />
            </button>

            {/* High-Contrast Visible Cross Symbol Button */}
            <button
              type="button"
              className="chat-header-btn dishly-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close Dishly"
              aria-label="Close Dishly"
            >
              <X size={18} strokeWidth={2.8} color="#FFFFFF" />
            </button>
          </div>
        </div>

        {/* ── Location Quick-Adaptation Bar ── */}
        <div className="chat-location-bar dishly-location-bar">
          <div className="chat-location-bar-label">
            <MapPin size={11} strokeWidth={2.5} />
            <span>Places:</span>
          </div>
          <div className="chat-location-chips">
            {DINING_LOCATIONS.map((loc) => {
              const isActive = (contextCity || '').toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  type="button"
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

        {/* ── History Drawer Overlay ── */}
        {showHistory ? (
          <div className="dishly-history-view">
            <div className="dishly-history-header">
              <div className="dishly-history-header-left">
                <Clock size={16} color="var(--color-primary)" />
                <span className="dishly-history-title">Saved Conversations</span>
              </div>
              <button
                type="button"
                className="dishly-history-new-btn"
                onClick={handleStartNewChat}
              >
                <Plus size={14} />
                <span>New Chat</span>
              </button>
            </div>

            <div className="dishly-history-list">
              {sessions.length === 0 ? (
                <div className="dishly-history-empty">
                  <MessageSquare size={32} strokeWidth={1.5} color="var(--color-ink-tertiary)" />
                  <p className="dishly-history-empty-title">No conversations saved yet</p>
                  <p className="dishly-history-empty-sub">
                    Ask Dishly about restaurants, street food, or dining tips to save your culinary chats here.
                  </p>
                </div>
              ) : (
                sessions.map((sess) => {
                  const isActive = sess.id === currentSessionId;
                  const msgCount = sess.messages ? sess.messages.filter(m => m.role === 'user').length : 0;
                  return (
                    <div
                      key={sess.id}
                      className={`dishly-history-item ${isActive ? 'dishly-history-item--active' : ''}`}
                      onClick={() => handleSelectSession(sess)}
                    >
                      <div className="dishly-history-item-icon">
                        <MessageSquare size={14} color={isActive ? "var(--color-primary)" : "var(--color-ink-secondary)"} />
                      </div>
                      <div className="dishly-history-item-body">
                        <div className="dishly-history-item-title">{sess.title}</div>
                        <div className="dishly-history-item-meta">
                          <span className="dishly-history-city-tag">{sess.city}</span>
                          <span>•</span>
                          <span>{formatSessionDate(sess.timestamp)}</span>
                          <span>•</span>
                          <span>{msgCount} queries</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="dishly-history-delete-btn"
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        title="Delete conversation"
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={13} color="var(--color-ink-tertiary)" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {sessions.length > 0 && (
              <div className="dishly-history-footer">
                <button
                  type="button"
                  className="dishly-clear-all-btn"
                  onClick={handleClearAllHistory}
                >
                  <Trash2 size={13} />
                  <span>Clear All History</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Chat Messages View ── */
          <div className="chat-messages-area">
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.id || i}
                msg={msg}
                isNew={msg._isNew && i === messages.length - 1}
                onSelectSuggestion={(sugText) => {
                  setInputText(sugText);
                  handleSend(sugText);
                }}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── Active Listening Banner (Voice Input) ── */}
        {isListening && (
          <div className="dishly-listening-banner">
            <div className="dishly-listening-status">
              <span className="dishly-listening-dot" />
              <span>Listening to your voice... Speak now</span>
            </div>
            <div className="dishly-soundwave">
              <span /><span /><span /><span /><span />
            </div>
            <button
              type="button"
              className="dishly-listening-stop-btn"
              onClick={toggleListening}
            >
              Done
            </button>
          </div>
        )}

        {/* ── Input Area ── */}
        <div className="chat-input-area dishly-input-area">
          <textarea
            ref={inputRef}
            className="chat-input dishly-input"
            placeholder={`Ask Dishly about restaurants, street food, veg cafes in ${contextCity}… 🍲`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={300}
          />

          {/* Microphone Voice Input Button */}
          <button
            type="button"
            className={`chat-mic-btn dishly-mic-btn ${isListening ? 'dishly-mic-btn--active' : ''}`}
            onClick={toggleListening}
            title={isListening ? "Listening... Click to stop" : "Speak with Microphone"}
            aria-label={isListening ? "Stop listening" : "Voice input with microphone"}
          >
            {isListening ? (
              <MicOff size={16} strokeWidth={2.4} color="#FFFFFF" />
            ) : (
              <Mic size={16} strokeWidth={2.2} />
            )}
          </button>

          {/* Send Button */}
          <button
            type="button"
            className={`chat-send-btn dishly-send-btn ${inputText.trim() ? 'chat-send-btn--active' : ''}`}
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            title="Send message"
            aria-label="Send message"
          >
            <Send size={15} strokeWidth={2.4} color={inputText.trim() ? '#FFFFFF' : 'inherit'} />
          </button>
        </div>

        <div className="chat-input-hint dishly-input-hint">
          <span>Powered by <strong>LukAround</strong></span>
          <span>•</span>
          <span>Press Enter to send · Shift+Enter for new line</span>
        </div>
      </div>
    </>
  );
}
