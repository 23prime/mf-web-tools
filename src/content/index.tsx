import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/content.css';

// Content Script component
function ContentWidget() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="mf-tools-container">
      <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-indigo-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">MF Tools</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-gray-600">
          Content script is running on this page
        </p>
      </div>
    </div>
  );
}

// Initialize content script
function init() {
  // Create container for React app
  const container = document.createElement('div');
  container.id = 'mf-tools-root';
  document.body.appendChild(container);

  // Render React component
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ContentWidget />
    </React.StrictMode>
  );

  console.log('MoneyForward Web Tools content script loaded');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
