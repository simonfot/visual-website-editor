import React, { useState, useEffect, useRef } from 'react';
import ProjectNavigator from './components/ProjectNavigator';
import VisualEditor from './components/VisualEditor';
import PropertiesPanel from './components/PropertiesPanel';
import AISuggestions from './components/AISuggestions';
import Toolbar from './components/Toolbar';
import Modal from './components/Modal';
import FileImporter from './components/FileImporter';
import CodeExporter from './components/CodeExporter';
import ComponentLibrary from './components/ComponentLibrary';
import HistoryManager from './utils/HistoryManager';
import keyboardShortcuts from './utils/KeyboardShortcuts';
import './App.css';

function App() {
  // Initial project state
  const initialProject = {
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
  };

  // Project state
  const [project, setProject] = useState(initialProject);
  
  // History management
  const historyManager = useRef(new HistoryManager(initialProject));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Selected element
  const [selectedElement, setSelectedElement] = useState(null);
  
  // AI suggestions
  const [suggestions, setSuggestions] = useState([]);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isComponentLibraryOpen, setIsComponentLibraryOpen] = useState(false);
  
  // Viewport/responsive mode
  const [viewport, setViewport] = useState('desktop');
  
  // Record project changes to history
  const recordHistory = (updatedProject) => {
    historyManager.current.pushState(updatedProject);
    setCanUndo(historyManager.current.canUndo());
    setCanRedo(historyManager.current.canRedo());
  };

  // Undo action
  const handleUndo = () => {
    const previousState = historyManager.current.undo();
    if (previousState) {
      setProject(previousState);
      setCanUndo(historyManager.current.canUndo());
      setCanRedo(historyManager.current.canRedo());
      
      // Deselect element if it no longer exists
      if (selectedElement) {
        const elementExists = previousState.pages.some(page => 
          page.elements.some(element => element.id === selectedElement.id)
        );
        if (!elementExists) {
          setSelectedElement(null);
        }
      }
    }
  };

  // Redo action
  const handleRedo = () => {
    const nextState = historyManager.current.redo();
    if (nextState) {
      setProject(nextState);
      setCanUndo(historyManager.current.canUndo());
      setCanRedo(historyManager.current.canRedo());
    }
  };

  // Add a new element to the current page
  const addElement = (elementType) => {
    const newElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      content: `New ${elementType}`,
      style: {},
      position: { x: 50, y: 50 }
    };
    
    const updatedProject = {
      ...project,
      pages: project.pages.map((page, index) => {
        if (index === 0) { // Currently targeting first page
          return {
            ...page,
            elements: [...page.elements, newElement]
          };
        }
        return page;
      })
    };
    
    setProject(updatedProject);
    recordHistory(updatedProject);
  };

  // Update element properties
  const updateElement = (elementId, properties) => {
    const updatedProject = {
      ...project,
      pages: project.pages.map(page => {
        const updatedElements = page.elements.map(element => {
          if (element.id === elementId) {
            const updatedElement = { ...element, ...properties };
            // If this is the selected element, update selectedElement reference
            if (selectedElement && selectedElement.id === elementId) {
              setSelectedElement(updatedElement);
            }
            return updatedElement;
          }
          return element;
        });
        return { ...page, elements: updatedElements };
      })
    };
    
    setProject(updatedProject);
    
    // Small optimization: Don't record every position change during dragging
    // Only record final position for drag operations
    if (!properties.hasOwnProperty('position') || properties._recordHistory) {
      recordHistory(updatedProject);
    }
  };

  // Delete an element
  const deleteElement = (elementId) => {
    const updatedProject = {
      ...project,
      pages: project.pages.map(page => ({
        ...page,
        elements: page.elements.filter(element => element.id !== elementId)
      }))
    };
    
    setProject(updatedProject);
    recordHistory(updatedProject);
    
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Add a component template from the library
  const addComponentTemplate = (template) => {
    const timestamp = Date.now();
    const newElements = template.elements.map((element, index) => ({
      ...element,
      id: `${element.type}-${timestamp}-${index}`,
      position: {
        x: element.position ? element.position.x : 50,
        y: element.position ? element.position.y : 50 + (index * 60)
      }
    }));
    
    const updatedProject = {
      ...project,
      pages: project.pages.map((page, index) => {
        if (index === 0) { // Currently targeting first page
          return {
            ...page,
            elements: [...page.elements, ...newElements]
          };
        }
        return page;
      })
    };
    
    setProject(updatedProject);
    recordHistory(updatedProject);
    setIsComponentLibraryOpen(false);
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
    if (importedData && importedData.length > 0) {
      // Process imported data and update project state
      console.log('Imported data:', importedData);
      
      // Example: If importing a JSON project file
      const jsonData = importedData.find(item => item.type === 'json');
      if (jsonData && jsonData.content) {
        setProject(jsonData.content);
        recordHistory(jsonData.content);
      }
    }
    
    setIsImportModalOpen(false);
  };

  // Initialize keyboard shortcuts
  useEffect(() => {
    // Register keyboard shortcuts
    keyboardShortcuts.register('undo', { key: 'z', ctrl: true }, handleUndo);
    keyboardShortcuts.register('redo', { key: 'y', ctrl: true }, handleRedo);
    keyboardShortcuts.register('delete', { key: 'Delete' }, () => {
      if (selectedElement) {
        deleteElement(selectedElement.id);
      }
    });
    
    // Clean up shortcuts when component unmounts
    return () => {
      keyboardShortcuts.unregister('undo');
      keyboardShortcuts.unregister('redo');
      keyboardShortcuts.unregister('delete');
    };
  }, [selectedElement]); // Dependency on selectedElement for delete shortcut

  // Initialize history manager
  useEffect(() => {
    historyManager.current = new HistoryManager(initialProject);
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return (
    <div className="app">
      <Toolbar 
        onAddElement={addElement}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onImport={() => setIsImportModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        onOpenComponentLibrary={() => setIsComponentLibraryOpen(true)}
        viewport={viewport}
        onViewportChange={setViewport}
      />
      
      <div className="editor-container">
        <ProjectNavigator 
          project={project}
          selectedElementId={selectedElement?.id}
          onSelectElement={(element) => setSelectedElement(element)}
        />
        
        <div className="canvas-container">
          <VisualEditor 
            elements={project.pages[0].elements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            viewport={viewport}
          />
        </div>
        
        <div className="right-panel">
          <PropertiesPanel 
            element={selectedElement}
            onUpdateElement={updateElement}
            viewport={viewport}
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
      
      {/* Component Library Modal */}
      <Modal
        isOpen={isComponentLibraryOpen}
        onClose={() => setIsComponentLibraryOpen(false)}
        title="Component Library"
        size="large"
      >
        <ComponentLibrary onSelectTemplate={addComponentTemplate} />
      </Modal>
    </div>
  );
}

export default App;
