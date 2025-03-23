import React, { useState, useRef, useEffect } from 'react';
import './VisualEditor.css';

const VisualEditor = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onUpdateElement,
  onDeleteElement,
  viewport = 'desktop'
}) => {
  const editorRef = useRef(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  // Calculate editor width based on viewport
  const getEditorWidth = () => {
    switch(viewport) {
      case 'mobile':
        return 375; // Standard mobile width
      case 'tablet':
        return 768; // Standard tablet width
      case 'desktop':
      default:
        return editorRef.current ? editorRef.current.offsetWidth : '100%';
    }
  };

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
    if (resizing) {
      // Handle resize logic
      handleResize(e);
      return;
    }
    
    if (!draggingElement) return;
    
    const editorRect = editorRef.current.getBoundingClientRect();
    const newX = e.clientX - editorRect.left - dragOffset.x;
    const newY = e.clientY - editorRect.top - dragOffset.y;
    
    // Constrain to editor boundaries
    const maxX = editorRect.width - 50; // Ensure at least part of element is visible
    
    onUpdateElement(draggingElement.id, {
      position: { 
        x: Math.max(0, Math.min(newX, maxX)), 
        y: Math.max(0, newY) 
      }
    });
  };

  // Start resizing an element
  const handleResizeStart = (e, element) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Get initial dimensions
    const width = parseInt(element.style.width) || 100;
    const height = parseInt(element.style.height) || 50;
    
    setResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ width, height });
  };
  
  // Handle element resizing
  const handleResize = (e) => {
    if (!resizing || !selectedElement) return;
    
    // Calculate size change
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    // Set minimum dimensions
    const newWidth = Math.max(50, initialSize.width + deltaX);
    const newHeight = Math.max(20, initialSize.height + deltaY);
    
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        width: `${newWidth}px`,
        height: `${newHeight}px`
      }
    });
  };

  // End dragging or resizing
  const handleMouseUp = () => {
    if (draggingElement) {
      // Record the final position in history
      onUpdateElement(draggingElement.id, {
        position: draggingElement.position,
        _recordHistory: true
      });
    }
    
    setDraggingElement(null);
    setResizing(false);
  };

  // Click on canvas background deselects elements
  const handleCanvasClick = (e) => {
    if (e.target === editorRef.current) {
      onSelectElement(null);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedElement) return;
      
      // Delete element with Delete or Backspace key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        onDeleteElement(selectedElement.id);
      }
      
      // Arrow keys to move element
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        
        const delta = e.shiftKey ? 10 : 1; // Larger moves with shift key
        const { x, y } = selectedElement.position;
        
        let newPosition = { x, y };
        
        switch (e.key) {
          case 'ArrowUp':
            newPosition.y = Math.max(0, y - delta);
            break;
          case 'ArrowDown':
            newPosition.y = y + delta;
            break;
          case 'ArrowLeft':
            newPosition.x = Math.max(0, x - delta);
            break;
          case 'ArrowRight':
            newPosition.x = x + delta;
            break;
          default:
            break;
        }
        
        onUpdateElement(selectedElement.id, { position: newPosition, _recordHistory: true });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, onDeleteElement, onUpdateElement]);

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
        
      case 'container':
        elementContent = (
          <div style={{
            ...elementStyle,
            width: elementStyle.width || '200px',
            height: elementStyle.height || '150px',
            border: '1px dashed #ccc',
            padding: '10px',
            backgroundColor: elementStyle.backgroundColor || '#f9f9f9'
          }}>
            {element.content || 'Container'}
          </div>
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
          top: `${element.position.y}px`,
          width: element.style.width,
          height: element.style.height
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
                title="Delete element"
              >
                ×
              </button>
            </div>
            
            <div 
              className="resize-handle bottom-right"
              onMouseDown={(e) => handleResizeStart(e, element)}
              title="Resize element"
            />
            
            <div 
              className="resize-handle bottom-left"
              onMouseDown={(e) => handleResizeStart(e, element)}
              title="Resize element"
            />
            
            <div 
              className="resize-handle top-right"
              onMouseDown={(e) => handleResizeStart(e, element)}
              title="Resize element"
            />
            
            <div 
              className="resize-handle top-left"
              onMouseDown={(e) => handleResizeStart(e, element)}
              title="Resize element"
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={editorRef}
      className={`visual-editor viewport-${viewport}`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: viewport !== 'desktop' ? `${getEditorWidth()}px` : '100%',
        margin: viewport !== 'desktop' ? '0 auto' : '0'
      }}
    >
      <div className="editor-grid" />
      {elements.map(renderElement)}
      
      {viewport !== 'desktop' && (
        <div className="viewport-overlay">
          <div className="viewport-size">
            {viewport === 'mobile' ? '375px' : '768px'}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;
