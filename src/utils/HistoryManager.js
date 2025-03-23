/**
 * HistoryManager - Manages history states for undo/redo functionality
 * Uses a stack-based approach with configurable max history size
 */
class HistoryManager {
  constructor(initialState, maxHistorySize = 50) {
    this.history = initialState ? [JSON.parse(JSON.stringify(initialState))] : [];
    this.currentIndex = 0;
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Record a new state in the history
   * @param {Object} state - The new state to record
   * @returns {number} Current history index
   */
  pushState(state) {
    if (!state) return this.currentIndex;
    
    // Create a deep clone to avoid reference issues
    const stateCopy = JSON.parse(JSON.stringify(state));
    
    // If we're not at the end of history, remove future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    // Add the new state to history
    this.history.push(stateCopy);
    
    // Trim history if it exceeds max size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
    
    return this.currentIndex;
  }

  /**
   * Move backward in history (undo)
   * @returns {Object|null} Previous state or null if at beginning
   */
  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  /**
   * Move forward in history (redo)
   * @returns {Object|null} Next state or null if at end
   */
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getCurrentState() {
    return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
  }

  /**
   * Get history stack size
   * @returns {number} History length
   */
  getHistorySize() {
    return this.history.length;
  }

  /**
   * Clear history
   * @param {Object} initialState - New initial state
   */
  clear(initialState = null) {
    this.history = initialState ? [JSON.parse(JSON.stringify(initialState))] : [];
    this.currentIndex = 0;
  }
}

export default HistoryManager;
