import React, { useState, useEffect } from 'react';
import ProjectNavigator from './components/ProjectNavigator';
import VisualEditor from './components/VisualEditor';
import PropertiesPanel from './components/PropertiesPanel';
import AISuggestions from './components/AISuggestions';
import Toolbar from './components/Toolbar';
import Modal from './components/Modal';
import FileImporter from './components/FileImporter';
import CodeExporter from './components/CodeExporter';
import './App.css';

function App() {
  // Project state
  const [project, setProject] = useState({
    pages: [
      { 
        id: 'home',
        name: 'Home',
        elements: [
          {
            id: 'header-1',
            type: 'header',
            content: 'My Website',
            style: {
              fontSize: '24px',
              color: '#333',
              fontWeight: 'bold'
            },
            position: { x: 20, y: 20 }
          },
          {
            id: 'paragraph-1',
            type: 'paragraph',
            content: 'Welcome to my website. This is an example of content you can edit.',
            style: {
              fontSize: '16px',
              color: '#666'
            },
            position: { x: 20, y: 60 }
          },
          {
            id: 'button-1',
            type: 'button',
            content: 'Click Me',
            style: {
              backgroundColor: '#0066cc',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none'
            },
            position: { x: 20, y: 120 }
          }
        ]
      }
    ],
    assets: []
  });

  // Currently selected element
  const [selectedElement, setSelectedElement] = useState(null);
  
  // AI suggestions based on selection
  const [suggestions, setSuggestions] = useState([]);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Add a new element to the current page
  const addElement = (elementType) => {
    const newElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      content: `New ${elementType}`,
      style: {},
      position: { x: 50, y: 50 }
    };
    
    setProject(prevProject => {
      const updatedPages = [...prevProject.pages];
      updatedPages[0].elements.push(newElement);
      return { ...prevProject, pages: updatedPages };
    });
  };

  // Update element properties
  const updateElement = (elementId, properties) => {
    setProject(prevProject => {
      const updatedPages = prevProject.pages.map(page => {
        const updatedElements = page.elements.map(element => {
          if (element.id === elementId) {
            return { ...element, ...properties };
          }
          return element;
        });
        return { ...page, elements: updatedElements };
      });
      
      return { ...prevProject, pages: updatedPages };
    });
  };

  // Delete an element
  const deleteElement = (elementId) => {
    setProject(prevProject => {
      const updatedPages = prevProject.pages.map(page => {
        const updatedElements = page.elements.filter(element => element.id !== elementId);
        return { ...page, elements: updatedElements };
      });
      
      return { ...prevProject, pages: updatedPages };
    });
    
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Get AI suggestions when an element is selected
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!selectedElement) {
        setSuggestions([]);
        return;
      }
      
      // This would be your Claude API call
      // For now, we'll simulate suggestions based on element type
      const mockSuggestions = {
        'header': [
          'Consider using a contrasting color for better visibility',
          'Add a subtle text shadow for depth',
          'Ensure heading is descriptive and SEO-friendly'
        ],
        'paragraph': [
          'Keep paragraphs concise for better readability',
          'Consider increasing line height for improved readability',
          'Add margins for better content separation'
        ],
        'button': [
          'Add hover effects for better interactivity',
          'Ensure button text clearly indicates action',
          'Consider using an icon alongside text for visual cues'
        ]
      };
      
      // Get suggestions for the selected element type
      const elementSuggestions = mockSuggestions[selectedElement.type] || [];
      setSuggestions(elementSuggestions);
    };
    
    fetchSuggestions();
  }, [selectedElement]);

  // Import project from uploaded file
  const handleImportComplete = (importedData) => {
    // Process imported data and update project state
    console.log('Imported data:', importedData);
    setIsImportModalOpen(false);
  };

  return (
    <div className="app">
      <Toolbar 
        onAddElement={addElement} 
        onImport={() => setIsImportModalOpen(true)} 
        onExport={() => setIsExportModalOpen(true)}
      />
      
      <div className="editor-container">
        <ProjectNavigator 
          project={project} 
          selectedElementId={selectedElement?.id} 
          onSelectElement={(element) => setSelectedElement(element)}
        />
        
        <VisualEditor 
          elements={project.pages[0].elements} 
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
        />
        
        <div className="right-panel">
          <PropertiesPanel 
            element={selectedElement} 
            onUpdateElement={updateElement}
          />
          
          <AISuggestions 
            suggestions={suggestions} 
            onApplySuggestion={(suggestionIndex) => {
              // Implement suggestion application logic
              console.log(`Applied suggestion ${suggestionIndex}`);
            }}
          />
        </div>
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Files"
        size="medium"
      >
        <FileImporter onImportComplete={handleImportComplete} />
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Code"
        size="large"
      >
        <CodeExporter project={project} />
      </Modal>
    </div>
  );
}

export default App;
