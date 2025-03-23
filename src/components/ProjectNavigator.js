import React, { useState } from 'react';
import './ProjectNavigator.css';

const ProjectNavigator = ({ project, selectedElementId, onSelectElement }) => {
  const [expandedPages, setExpandedPages] = useState({
    [project.pages[0].id]: true // Initially expand the first page
  });

  const togglePageExpand = (pageId) => {
    setExpandedPages({
      ...expandedPages,
      [pageId]: !expandedPages[pageId]
    });
  };

  const handleElementSelect = (page, element) => {
    onSelectElement(element);
  };

  return (
    <div className="project-navigator">
      <div className="navigator-header">
        <h3>Project Structure</h3>
      </div>

      <div className="sections">
        <div className="section">
          <div className="section-header">
            <h4>Pages</h4>
            <button className="add-button" title="Add new page">+</button>
          </div>
          
          <div className="section-content">
            {project.pages.map(page => (
              <div key={page.id} className="navigator-item">
                <div 
                  className="page-item"
                  onClick={() => togglePageExpand(page.id)}
                >
                  <span className={`expand-icon ${expandedPages[page.id] ? 'expanded' : ''}`}>▶</span>
                  <span className="page-name">{page.name}</span>
                </div>
                
                {expandedPages[page.id] && (
                  <div className="page-elements">
                    {page.elements.map(element => (
                      <div 
                        key={element.id}
                        className={`element-item ${selectedElementId === element.id ? 'selected' : ''}`}
                        onClick={() => handleElementSelect(page, element)}
                      >
                        <span className="element-icon">
                          {element.type === 'header' ? 'H' :
                           element.type === 'paragraph' ? '¶' :
                           element.type === 'button' ? '□' :
                           element.type === 'image' ? '🖼️' : '○'}
                        </span>
                        <span className="element-name">
                          {element.type} {element.id.split('-')[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="section">
          <div className="section-header">
            <h4>Assets</h4>
            <button className="add-button" title="Add asset">+</button>
          </div>
          
          <div className="section-content">
            {project.assets && project.assets.length > 0 ? (
              project.assets.map(asset => (
                <div key={asset.id} className="navigator-item">
                  <div className="asset-item">
                    <span className="asset-icon">
                      {asset.type === 'image' ? '🖼️' :
                       asset.type === 'video' ? '🎬' :
                       asset.type === 'audio' ? '🎵' : '📄'}
                    </span>
                    <span className="asset-name">{asset.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No assets added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNavigator;
