import React from 'react';
import './ResponsiveControls.css';

const ResponsiveControls = ({ viewport, onViewportChange }) => {
  const viewports = [
    { id: 'mobile', label: 'Mobile', icon: '📱', width: '375px' },
    { id: 'tablet', label: 'Tablet', icon: '💻', width: '768px' },
    { id: 'desktop', label: 'Desktop', icon: '🖥️', width: '100%' }
  ];

  return (
    <div className="responsive-controls">
      <div className="viewport-buttons">
        {viewports.map(item => (
          <button
            key={item.id}
            className={`viewport-button ${viewport === item.id ? 'active' : ''}`}
            onClick={() => onViewportChange(item.id)}
            title={`Switch to ${item.label} view (${item.width})`}
          >
            <span className="viewport-icon">{item.icon}</span>
            <span className="viewport-label">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="viewport-info">
        <span>Current: {viewport}</span>
        <span className="viewport-width">
          {viewports.find(v => v.id === viewport)?.width}
        </span>
      </div>
    </div>
  );
};

export default ResponsiveControls;
