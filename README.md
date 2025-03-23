# Visual Website Editor

A drag-and-drop website editor with Claude AI integration for design suggestions.

## Features

- **Intuitive Visual Editor**
  - Drag and drop elements
  - Real-time preview
  - Contextual controls on selected elements
  - Multiple viewport sizes (desktop, tablet, mobile)

- **Project Structure Navigator**
  - Tree view of all pages and components
  - Easy reorganization of elements
  - Section and page management

- **Properties Panel**
  - Control styling, position, and content
  - Tabbed interface for different property types
  - Real-time updates

- **Claude AI Integration**
  - Smart suggestions based on selected elements
  - Custom advice on demand
  - UX/UI improvement recommendations

- **Import/Export Capabilities**
  - Import existing HTML, CSS, JS files
  - Export as HTML/CSS/JS, React, or Vue
  - Save and load projects

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/simonfot/visual-website-editor.git
   ```

2. Install dependencies
   ```
   cd visual-website-editor
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open http://localhost:3000 to view the app in your browser

## API Integration

To use the Claude AI suggestions feature, you'll need to add your API key to a `.env` file:

```
REACT_APP_CLAUDE_API_KEY=your_api_key_here
```

## License

MIT
