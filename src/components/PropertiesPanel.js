import React, { useState } from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ element, onUpdateElement }) => {
  const [activeTab, setActiveTab] = useState('style');
  
  if (!element) {
    return (
      <div className="properties-panel">
        <div className="empty-state">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleContentChange = (e) => {
    onUpdateElement(element.id, { content: e.target.value });
  };

  const handleStyleChange = (property, value) => {
    onUpdateElement(element.id, {
      style: {
        ...element.style,
        [property]: value
      }
    });
  };

  const renderStyleEditor = () => {
    return (
      <div className="style-editor">
        <div className="property-group">
          <h4>Typography</h4>
          
          <div className="property-field">
            <label>Font Size</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={parseInt(element.style.fontSize) || 16}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              />
              <span className="unit">px</span>
            </div>
          </div>
          
          <div className="property-field">
            <label>Font Weight</label>
            <select
              value={element.style.fontWeight || 'normal'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Light</option>
            </select>
          </div>
          
          <div className="property-field">
            <label>Text Color</label>
            <input
              type="color"
              value={element.style.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
        </div>
        
        <div className="property-group">
          <h4>Layout</h4>
          
          <div className="property-field">
            <label>Width</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={parseInt(element.style.width) || ''}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`)}
              />
              <span className="unit">px</span>
            </div>
          </div>
          
          <div className="property-field">
            <label>Height</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={parseInt(element.style.height) || ''}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`)}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
        
        <div className="property-group">
          <h4>Appearance</h4>
          
          <div className="property-field">
            <label>Background Color</label>
            <input
              type="color"
              value={element.style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
          </div>
          
          <div className="property-field">
            <label>Border Radius</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={parseInt(element.style.borderRadius) || 0}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContentEditor = () => {
    // Different content editor based on element type
    switch (element.type) {
      case 'header':
      case 'paragraph':
        return (
          <div className="content-editor">
            <textarea
              value={element.content || ''}
              onChange={handleContentChange}
              rows={5}
            />
          </div>
        );
        
      case 'button':
        return (
          <div className="content-editor">
            <input
              type="text"
              value={element.content || ''}
              onChange={handleContentChange}
              placeholder="Button Text"
            />
          </div>
        );
        
      case 'image':
        return (
          <div className="content-editor">
            <div className="property-field">
              <label>Image URL</label>
              <input
                type="text"
                value={element.src || ''}
                onChange={(e) => onUpdateElement(element.id, { src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="property-field">
              <label>Alt Text</label>
              <input
                type="text"
                value={element.alt || ''}
                onChange={(e) => onUpdateElement(element.id, { alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="content-editor">
            <textarea
              value={element.content || ''}
              onChange={handleContentChange}
              rows={5}
            />
          </div>
        );
    }
  };

  return (
    <div className="properties-panel">
      <div className="element-info">
        <div className="element-type">{element.type}</div>
        <div className="element-id">{element.id}</div>
      </div>
      
      <div className="panel-tabs">
        <button
          className={activeTab === 'style' ? 'active' : ''}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
      </div>
      
      <div className="panel-content">
        {activeTab === 'style' ? renderStyleEditor() : renderContentEditor()}
      </div>
    </div>
  );
};

export default PropertiesPanel;
