import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  const modalRef = useRef(null);
  
  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === modalRef.current) {
      onClose();
    }
  };
  
  // Don't render if modal is not open
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay" 
      ref={modalRef}
      onClick={handleOverlayClick}
    >
      <div className={`modal-content modal-${size}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          {showCloseButton && (
            <button 
              className="modal-close-button"
              onClick={onClose}
            >
              ×
            </button>
          )}
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
