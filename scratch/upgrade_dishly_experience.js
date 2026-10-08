const fs = require('fs');
const path = require('path');

// ── 1. UPGRADE AiChatWidget.jsx ──────────────────────────────────────────────
const aiChatPath = path.resolve(__dirname, '../frontend/src/components/AiChatWidget.jsx');
let aiChat = fs.readFileSync(aiChatPath, 'utf8');

// Replace Volume2 import with Volume2, VolumeX
aiChat = aiChat.replace(
  "Clock, ArrowRight, RefreshCw, Volume2,\r\n  Compass, Flame, Utensils",
  "Clock, ArrowRight, RefreshCw, Volume2, VolumeX,\r\n  Compass, Flame, Utensils"
);
aiChat = aiChat.replace(
  "Clock, ArrowRight, RefreshCw, Volume2,\n  Compass, Flame, Utensils",
  "Clock, ArrowRight, RefreshCw, Volume2, VolumeX,\n  Compass, Flame, Utensils"
);

// Upgrade ChatMessage with TTS and onSelectSuggestion passed to ChatResponseCard
const oldChatMessageMarker = "function ChatMessage({ msg, isNew, onSelectSuggestion }) {";
const newChatMessageImpl = `function ChatMessage({ msg, isNew, onSelectSuggestion }) {
  const isBot = msg.role === 'assistant';
  const [displayed, setDisplayed] = useState(isNew && isBot ? '' : msg.text);
  const [done, setDone] = useState(!isNew || !isBot);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!isNew || !isBot || !msg.text) return;
    const cleanup = createTypingAnimator(
      msg.text,
      (current) => setDisplayed(current),
      () => setDone(true),
      20
    );
    cleanupRef.current = cleanup;
    return cleanup;
  }, [msg.text, isNew, isBot]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleCopy = () => {
    if (!msg.text) return;
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    // Clean emojis and decorative symbols for smooth speech
    const cleanText = (msg.text || '').replace(/[\\u{1F600}-\\u{1F64F}\\u{1F300}-\\u{1F5FF}\\u{1F680}-\\u{1F6FF}\\u{1F1E0}-\\u{1F1FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={\`chat-msg-row \${isBot ? 'chat-msg-bot' : 'chat-msg-user'}\`}>
      {isBot && (
        <div className="chat-avatar chat-avatar-bot dishly-bot-avatar" title="Dishly AI">
          <img src={logoMark} alt="Dishly AI" className="dishly-avatar-logo" />
        </div>
      )}

      <div className="chat-bubble-wrap">
        {/* Text bubble */}
        <div className={\`chat-bubble \${isBot ? 'chat-bubble-bot' : 'chat-bubble-user'}\`}>
          <div className="chat-bubble-content">
            {displayed}
            {isBot && !done && <span className="chat-cursor">▌</span>}
          </div>

          {/* Action buttons for bot messages */}
          {isBot && done && msg.text && msg.id !== 'greeting' && (
            <div className="chat-bubble-actions">
              <button
                type="button"
                className={\`chat-action-icon-btn \${isSpeaking ? 'chat-action-icon-btn--speaking' : ''}\`}
                onClick={handleToggleSpeak}
                title={isSpeaking ? "Stop voice readout" : "Listen to Dishly (Voice Readout)"}
                aria-label="Listen to message"
              >
                {isSpeaking ? <VolumeX size={12} color="#E11D48" /> : <Volume2 size={12} />}
              </button>
              <button
                type="button"
                className="chat-action-icon-btn"
                onClick={handleCopy}
                title={copied ? "Copied to clipboard!" : "Copy response"}
                aria-label="Copy text"
              >
                {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
              </button>
            </div>
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
              onSelectSuggestion={onSelectSuggestion}
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
                className="chat-chip dishly-smart-chip"
                onClick={() => onSelectSuggestion && onSelectSuggestion(s)}
              >
                <span>{s}</span>
                <Sparkles size={11} className="dishly-chip-sparkle" />
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
}`;

// Find start and end of ChatMessage function
const startIdx = aiChat.indexOf(oldChatMessageMarker);
const endMarker = "// ── Loading animation ─────────────────────────────────────────────────────────";
const endIdx = aiChat.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  aiChat = aiChat.slice(0, startIdx) + newChatMessageImpl + "\n\n" + aiChat.slice(endIdx);
  fs.writeFileSync(aiChatPath, aiChat, 'utf8');
  console.log('✅ Successfully upgraded AiChatWidget.jsx with TTS and interactive cards!');
} else {
  console.error('❌ Could not find ChatMessage boundaries in AiChatWidget.jsx', { startIdx, endIdx });
}
