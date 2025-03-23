import axios from 'axios';

class ClaudeAPI {
  constructor() {
    // Get API key from environment variables
    this.apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
  }

  /**
   * Get suggestions for improving an element based on its properties
   * @param {Object} element - The selected element to get suggestions for
   * @param {Object} context - Additional context about the project
   * @returns {Promise<Array<string>>} - Array of improvement suggestions
   */
  async getSuggestions(element, context = {}) {
    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `I'm designing a website and want suggestions for my ${element.type} element. 
            
Current properties:
${JSON.stringify(element, null, 2)}

Context of the website:
${JSON.stringify(context, null, 2)}

Please provide 3-5 specific suggestions for improving this element's design, UX, or content. Focus on practical tips that would make this element more effective, visually appealing, or user-friendly. Format each suggestion as a single paragraph.`
          }
        ]
      });

      // Extract suggestions from the response
      const suggestions = this._parseSuggestions(response.data.content[0].text);
      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions from Claude:', error);
      return [
        'Unable to get suggestions at this time. Please try again later.'
      ];
    }
  }

  /**
   * Get custom advice based on user prompt
   * @param {string} prompt - User's question about the element
   * @param {Object} element - The selected element
   * @returns {Promise<string>} - Claude's advice
   */
  async getCustomAdvice(prompt, element) {
    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `I'm working on a website element (${element.type}) with these properties:
            
${JSON.stringify(element, null, 2)}

Here's my question: ${prompt}

Please provide specific, actionable advice that I can apply to improve this element. Be concise but thorough.`
          }
        ]
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error getting custom advice from Claude:', error);
      return 'Unable to get advice at this time. Please try again later.';
    }
  }

  /**
   * Generate code based on a description
   * @param {string} description - Description of the code to generate
   * @returns {Promise<string>} - Generated code
   */
  async generateCode(description) {
    try {
      const response = await this.client.post('/messages', {
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Generate clean, well-commented code for the following description:
            
${description}

Provide only the code without explanations.`
          }
        ]
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error('Error generating code with Claude:', error);
      return '// Error generating code. Please try again.';
    }
  }

  /**
   * Parse suggestions from Claude's response
   * @private
   * @param {string} response - Raw response from Claude
   * @returns {Array<string>} - Array of suggestions
   */
  _parseSuggestions(response) {
    // Simple parsing - split by numbered items or paragraphs
    const suggestions = response
      .split(/\d+\.\s+/)
      .filter(Boolean)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return suggestions.length > 0 ? suggestions : [response.trim()];
  }
}

export default ClaudeAPI;