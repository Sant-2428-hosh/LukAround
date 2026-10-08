import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/IndiaTourism.css';

// ── Google Translate & DOM Translation React Reconciliation Guard ──
// Prevents React fatal "NotFoundError: Failed to execute 'removeChild' on 'Node'" when translation engines wrap text nodes
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      if (console && console.warn) console.warn('[DOM Translator] Intercepted removeChild mismatch');
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console && console.warn) console.warn('[DOM Translator] Intercepted insertBefore mismatch');
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
