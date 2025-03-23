import React, { useState } from 'react';
import './AISuggestions.css';

const AISuggestions = ({ suggestions, onApplySuggestion }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleRequestCustomSuggestion = async () => {
    if (!customPrompt.trim()) return;
    
    setIsLoading(true);
    
    // This would be your actual Claude API call
    // For demo purposes, we'll simulate a response after a delay
    setTimeout(() => {
      // Mock response
      console.log('Custom suggestion requested:', customPrompt);
      setIsLoading(false);
      setCustomPrompt('');
    }, 1500);
  };

  return (
    <div className={`ai-suggestions ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <h3>
          <span className="ai-icon">🧠</span>
          AI Suggestions
          <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
        </h3>
      </div>
      
      {!isCollapsed && (
        <div className="suggestions-content">
          {suggestions.length === 0 ? (
            <div className="empty-suggestions">
              <p>Select an element to get AI suggestions</p>
            </div>
          ) : (
            <>
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <p>{suggestion}</p>
                    <button 
                      className="apply-button"
                      onClick={() => onApplySuggestion(index)}
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="custom-suggestion">
                <textarea
                  placeholder="Ask Claude for advice on this element..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  className="request-button"
                  onClick={handleRequestCustomSuggestion}
                  disabled={isLoading || !customPrompt.trim()}
                >
                  {isLoading ? 'Thinking...' : 'Ask Claude'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
