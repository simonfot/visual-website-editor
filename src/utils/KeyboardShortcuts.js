/**
 * KeyboardShortcuts - A utility for registering and handling keyboard shortcuts
 * 
 * This utility helps manage keyboard shortcuts in the editor, allowing various
 * components to define shortcuts without conflicting with each other.
 */

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.isListening = false;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Register a new keyboard shortcut
   * @param {string} id - Unique identifier for the shortcut
   * @param {Object} options - Shortcut configuration
   * @param {string} options.key - Key code (e.g., 'z', 'y', 'Delete')
   * @param {boolean} options.ctrl - Require Control key
   * @param {boolean} options.shift - Require Shift key
   * @param {boolean} options.alt - Require Alt key
   * @param {Function} callback - Function to call when shortcut is triggered
   * @returns {boolean} - Success status
   */
  register(id, options, callback) {
    if (this.shortcuts.has(id)) {
      console.warn(`Keyboard shortcut "${id}" is already registered.`);
      return false;
    }

    this.shortcuts.set(id, { ...options, callback });
    
    // Start listening if this is the first shortcut
    if (!this.isListening) {
      this.startListening();
    }
    
    return true;
  }

  /**
   * Unregister a keyboard shortcut
   * @param {string} id - Identifier of the shortcut to remove
   * @returns {boolean} - Success status
   */
  unregister(id) {
    const success = this.shortcuts.delete(id);
    
    // Stop listening if no shortcuts are registered
    if (success && this.shortcuts.size === 0) {
      this.stopListening();
    }
    
    return success;
  }

  /**
   * Start listening for keyboard events
   * @private
   */
  startListening() {
    window.addEventListener('keydown', this.handleKeyDown);
    this.isListening = true;
  }

  /**
   * Stop listening for keyboard events
   * @private
   */
  stopListening() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.isListening = false;
  }

  /**
   * Handle keydown events and trigger registered callbacks
   * @private
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyDown(event) {
    // Skip if inside input or textarea
    const tagName = event.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
      return;
    }

    // Check each shortcut against the current key combo
    for (const [id, shortcut] of this.shortcuts.entries()) {
      const keyMatch = 
        (shortcut.key.toLowerCase() === event.key.toLowerCase()) ||
        (shortcut.key === 'Delete' && (event.key === 'Delete' || event.key === 'Backspace'));
      
      const ctrlMatch = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
      const shiftMatch = !!shortcut.shift === event.shiftKey;
      const altMatch = !!shortcut.alt === event.altKey;
      
      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.callback(event);
        break;
      }
    }
  }

  /**
   * Get a descriptive string for a shortcut
   * @param {string} id - Shortcut identifier
   * @returns {string} - Human-readable shortcut description
   */
  getShortcutDescription(id) {
    const shortcut = this.shortcuts.get(id);
    if (!shortcut) return '';
    
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    
    // Capitalize first letter of key for readability
    let key = shortcut.key;
    if (key.length === 1) {
      key = key.toUpperCase();
    }
    
    parts.push(key);
    return parts.join('+');
  }
}

// Create a singleton instance
const keyboardShortcuts = new KeyboardShortcuts();

export default keyboardShortcuts;
