import React, { useState } from 'react';
import ClaudeAPI from '../services/ClaudeAPI';
import './AISuggestions.css';

const AISuggestions = ({ suggestions, onApplySuggestion, selectedElement }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customSuggestions, setCustomSuggestions] = useState([]);
  
  // Initialize Claude API
  const claudeAPI = new ClaudeAPI();

  const handleRequestCustomSuggestion = async () => {
    if (!customPrompt.trim() || !selectedElement) return;
    
    setIsLoading(true);
    
    try {
      // Get advice from Claude API
      const advice = await claudeAPI.getCustomAdvice(customPrompt, selectedElement);
      
      // Add the new suggestion to the custom suggestions
      setCustomSuggestions([...customSuggestions, advice]);
      
      // Clear the prompt
      setCustomPrompt('');
    } catch (error) {
      console.error('Error getting custom advice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine default and custom suggestions
  const allSuggestions = [...suggestions, ...customSuggestions];

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
          {allSuggestions.length === 0 ? (
            <div className="empty-suggestions">
              <p>Select an element to get AI suggestions</p>
            </div>
          ) : (
            <>
              <div className="suggestions-list">
                {allSuggestions.map((suggestion, index) => (
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
                  disabled={isLoading || !selectedElement}
                />
                <button 
                  className="request-button"
                  onClick={handleRequestCustomSuggestion}
                  disabled={isLoading || !customPrompt.trim() || !selectedElement}
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