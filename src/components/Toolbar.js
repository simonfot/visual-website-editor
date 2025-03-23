import React, { useState, useRef } from 'react';
import './Toolbar.css';

const Toolbar = ({ 
  onAddElement, 
  onImport, 
  onExport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onOpenComponentLibrary,
  viewport,
  onViewportChange
}) => {
  const [showElementMenu, setShowElementMenu] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleAddElementClick = () => {
    setShowElementMenu(!showElementMenu);
  };
  
  const handleElementSelect = (elementType) => {
    onAddElement(elementType);
    setShowElementMenu(false);
  };
  
  const handleImportClick = () => {
    if (onImport) {
      onImport();
    } else {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Process file import
      console.log('File selected:', file.name);
    }
    // Reset the input so the same file can be selected again
    e.target.value = null;
  };
  
  // List of element types with icons
  const elementTypes = [
    { type: 'header', icon: 'H', label: 'Heading' },
    { type: 'paragraph', icon: '¶', label: 'Paragraph' },
    { type: 'button', icon: '□', label: 'Button' },
    { type: 'image', icon: '🖼️', label: 'Image' },
    { type: 'container', icon: '▣', label: 'Container' }
  ];
  
  return (
    <div className="toolbar">
      <div className="left-tools">
        <button 
          className={`tool-button ${!canUndo ? 'disabled' : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <span role="img" aria-label="Undo">↩️</span>
          <span className="tooltip">Undo</span>
        </button>
        
        <button 
          className={`tool-button ${!canRedo ? 'disabled' : ''}`}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <span role="img" aria-label="Redo">↪️</span>
          <span className="tooltip">Redo</span>
        </button>
        
        <div className="separator"></div>
        
        <div className="dropdown-container">
          <button className="tool-button" onClick={handleAddElementClick} title="Add new element">
            <span role="img" aria-label="Add Element">➕</span>
            <span>Add Element</span>
            <span className="tooltip">Add a new element</span>
          </button>
          
          {showElementMenu && (
            <div className="dropdown-menu">
              {elementTypes.map(({ type, icon, label }) => (
                <div 
                  key={type} 
                  className="dropdown-item"
                  onClick={() => handleElementSelect(type)}
                >
                  <span className="element-icon">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="tool-button components-button"
          onClick={onOpenComponentLibrary}
          title="Open component library"
        >
          <span role="img" aria-label="Component Library">🧩</span>
          <span>Components</span>
          <span className="tooltip">Browse component templates</span>
        </button>
      </div>
      
      <div className="center-tools">
        <select 
          className="viewport-select"
          value={viewport}
          onChange={(e) => onViewportChange(e.target.value)}
          title="Change viewport size"
        >
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>
        
        <div className="zoom-controls">
          <button className="tool-button">
            <span>-</span>
          </button>
          <span className="zoom-level">100%</span>
          <button className="tool-button">
            <span>+</span>
          </button>
        </div>
      </div>
      
      <div className="right-tools">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json,.html,.css"
          onChange={handleFileChange}
        />
        
        <button className="tool-button" onClick={handleImportClick} title="Import project or files">
          <span role="img" aria-label="Import">📥</span>
          <span>Import</span>
          <span className="tooltip">Import project</span>
        </button>
        
        <button className="tool-button" onClick={onExport} title="Export project as code">
          <span role="img" aria-label="Export">📤</span>
          <span>Export</span>
          <span className="tooltip">Export project</span>
        </button>
        
        <button className="tool-button preview-button" title="Preview website">
          <span role="img" aria-label="Preview">👁️</span>
          <span>Preview</span>
          <span className="tooltip">Preview website</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
