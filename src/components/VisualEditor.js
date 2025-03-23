import React, { useState, useRef } from 'react';
import './VisualEditor.css';

const VisualEditor = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onUpdateElement,
  onDeleteElement 
}) => {
  const editorRef = useRef(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Start dragging an element
  const handleElementMouseDown = (e, element) => {
    if (e.target.classList.contains('resize-handle')) {
      return; // Let the resize handler manage this
    }
    
    e.stopPropagation();
    onSelectElement(element);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    
    setDraggingElement(element);
    setDragOffset({
      x: e.clientX - (rect.left - editorRect.left),
      y: e.clientY - (rect.top - editorRect.top)
    });
  };

  // Handle element dragging
  const handleMouseMove = (e) => {
    if (!draggingElement) return;
    
    const editorRect = editorRef.current.getBoundingClientRect();
    const newX = e.clientX - editorRect.left - dragOffset.x;
    const newY = e.clientY - editorRect.top - dragOffset.y;
    
    onUpdateElement(draggingElement.id, {
      position: { x: Math.max(0, newX), y: Math.max(0, newY) }
    });
  };

  // End dragging
  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  // Handle element resizing
  const handleResize = (element, width, height) => {
    onUpdateElement(element.id, {
      style: {
        ...element.style,
        width: `${width}px`,
        height: `${height}px`
      }
    });
  };

  // Click on canvas background deselects elements
  const handleCanvasClick = (e) => {
    if (e.target === editorRef.current) {
      onSelectElement(null);
    }
  };

  const renderElement = (element) => {
    const isSelected = selectedElement && selectedElement.id === element.id;
    const elementStyle = {
      ...element.style,
      position: 'absolute',
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      cursor: draggingElement && draggingElement.id === element.id ? 'grabbing' : 'grab'
    };

    let elementContent;
    
    switch (element.type) {
      case 'header':
        elementContent = <h2 style={elementStyle}>{element.content}</h2>;
        break;
        
      case 'paragraph':
        elementContent = <p style={elementStyle}>{element.content}</p>;
        break;
        
      case 'button':
        elementContent = (
          <button 
            style={elementStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {element.content}
          </button>
        );
        break;
        
      case 'image':
        elementContent = (
          <img 
            src={element.src || 'https://via.placeholder.com/150'} 
            alt={element.alt || 'placeholder'} 
            style={elementStyle}
          />
        );
        break;
        
      default:
        elementContent = <div style={elementStyle}>{element.content}</div>;
    }

    return (
      <div
        key={element.id}
        className={`editor-element ${isSelected ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: `${element.position.x}px`,
          top: `${element.position.y}px`
        }}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
      >
        {elementContent}
        
        {isSelected && (
          <>
            <div className="element-controls">
              <button 
                className="delete-button"
                onClick={() => onDeleteElement(element.id)}
              >
                ×
              </button>
            </div>
            
            <div 
              className="resize-handle bottom-right"
              onMouseDown={(e) => {
                e.stopPropagation();
                // Add resize handling logic here
              }}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={editorRef}
      className="visual-editor"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="editor-grid" />
      {elements.map(renderElement)}
    </div>
  );
};

export default VisualEditor;
