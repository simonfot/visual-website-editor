import React, { useState } from 'react';
import './ComponentLibrary.css';

// Component template definitions
const componentTemplates = {
  'hero-section': {
    name: 'Hero Section',
    description: 'A full-width banner with heading, text and call-to-action button',
    category: 'Layout',
    thumbnail: '🖼️',
    elements: [
      {
        type: 'header',
        content: 'Welcome to My Website',
        style: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          width: '400px'
        },
        position: { x: 50, y: 50 }
      },
      {
        type: 'paragraph',
        content: 'This is a hero section with a compelling headline, description text, and a clear call-to-action button to engage your visitors.',
        style: {
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.5',
          width: '400px'
        },
        position: { x: 50, y: 100 }
      },
      {
        type: 'button',
        content: 'Get Started',
        style: {
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        },
        position: { x: 50, y: 180 }
      }
    ]
  },
  'features-section': {
    name: 'Features Grid',
    description: 'A 3-column grid highlighting product/service features',
    category: 'Layout',
    thumbnail: '📊',
    elements: [
      {
        type: 'header',
        content: 'Key Features',
        style: {
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          width: '300px'
        },
        position: { x: 200, y: 50 }
      },
      // Feature 1
      {
        type: 'container',
        content: 'Feature 1',
        style: {
          width: '180px',
          height: '150px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        position: { x: 50, y: 100 }
      },
      {
        type: 'header',
        content: 'Feature 1',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        },
        position: { x: 65, y: 115 }
      },
      {
        type: 'paragraph',
        content: 'Description of the first amazing feature of your product.',
        style: {
          fontSize: '14px',
          color: '#666',
          width: '150px'
        },
        position: { x: 65, y: 145 }
      },
      // Feature 2
      {
        type: 'container',
        content: 'Feature 2',
        style: {
          width: '180px',
          height: '150px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        position: { x: 260, y: 100 }
      },
      {
        type: 'header',
        content: 'Feature 2',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        },
        position: { x: 275, y: 115 }
      },
      {
        type: 'paragraph',
        content: 'Description of the second amazing feature of your product.',
        style: {
          fontSize: '14px',
          color: '#666',
          width: '150px'
        },
        position: { x: 275, y: 145 }
      },
      // Feature 3
      {
        type: 'container',
        content: 'Feature 3',
        style: {
          width: '180px',
          height: '150px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        position: { x: 470, y: 100 }
      },
      {
        type: 'header',
        content: 'Feature 3',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        },
        position: { x: 485, y: 115 }
      },
      {
        type: 'paragraph',
        content: 'Description of the third amazing feature of your product.',
        style: {
          fontSize: '14px',
          color: '#666',
          width: '150px'
        },
        position: { x: 485, y: 145 }
      }
    ]
  },
  'contact-form': {
    name: 'Contact Form',
    description: 'A simple contact form layout with fields and submit button',
    category: 'Form',
    thumbnail: '📝',
    elements: [
      {
        type: 'header',
        content: 'Contact Us',
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          width: '300px'
        },
        position: { x: 50, y: 50 }
      },
      {
        type: 'paragraph',
        content: 'Have questions? Fill out the form below and we\'ll get back to you shortly.',
        style: {
          fontSize: '16px',
          color: '#666',
          width: '300px'
        },
        position: { x: 50, y: 90 }
      },
      {
        type: 'container',
        content: 'Form Container',
        style: {
          width: '300px',
          height: '200px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #ddd'
        },
        position: { x: 50, y: 130 }
      },
      {
        type: 'button',
        content: 'Submit',
        style: {
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        },
        position: { x: 50, y: 350 }
      }
    ]
  },
  'testimonial-card': {
    name: 'Testimonial Card',
    description: 'Customer testimonial with quote and attribution',
    category: 'Content',
    thumbnail: '💬',
    elements: [
      {
        type: 'container',
        content: 'Testimonial Container',
        style: {
          width: '350px',
          height: '200px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        },
        position: { x: 50, y: 50 }
      },
      {
        type: 'paragraph',
        content: '"This product has completely transformed how we work. The features are intuitive and the support team is exceptional. Highly recommended!"',
        style: {
          fontSize: '16px',
          color: '#555',
          fontStyle: 'italic',
          lineHeight: '1.5',
          width: '310px'
        },
        position: { x: 70, y: 70 }
      },
      {
        type: 'header',
        content: 'Jane Smith',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          width: '310px'
        },
        position: { x: 70, y: 170 }
      },
      {
        type: 'paragraph',
        content: 'CEO, Example Company',
        style: {
          fontSize: '14px',
          color: '#777',
          width: '310px'
        },
        position: { x: 70, y: 195 }
      }
    ]
  },
  'pricing-table': {
    name: 'Pricing Table',
    description: 'Three-tier pricing table with features and CTA buttons',
    category: 'Content',
    thumbnail: '💰',
    elements: [
      {
        type: 'header',
        content: 'Pricing Plans',
        style: {
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          width: '500px'
        },
        position: { x: 150, y: 50 }
      },
      // Basic Plan
      {
        type: 'container',
        content: 'Basic Plan',
        style: {
          width: '180px',
          height: '250px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        },
        position: { x: 50, y: 100 }
      },
      {
        type: 'header',
        content: 'Basic',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          width: '150px'
        },
        position: { x: 65, y: 115 }
      },
      {
        type: 'header',
        content: '$9.99/mo',
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#0066cc',
          textAlign: 'center',
          width: '150px'
        },
        position: { x: 65, y: 150 }
      },
      {
        type: 'paragraph',
        content: '• Basic feature 1\n• Basic feature 2\n• Basic feature 3',
        style: {
          fontSize: '14px',
          color: '#666',
          width: '150px',
          whiteSpace: 'pre-line'
        },
        position: { x: 65, y: 190 }
      },
      {
        type: 'button',
        content: 'Choose Plan',
        style: {
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          width: '120px',
          textAlign: 'center'
        },
        position: { x: 80, y: 300 }
      },
      // Pro Plan
      {
        type: 'container',
        content: 'Pro Plan',
        style: {
          width: '180px',
          height: '250px',
          backgroundColor: '#f0f7ff',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          border: '1px solid #cce5ff'
        },
        position: { x: 260, y: 100 }
      },
      {
        type: 'header',
        content: 'Pro',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          width: '150px'
        },
        position: { x: 275, y: 115 }
      },
      {
        type: 'header',
        content: '$19.99/mo',
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#0066cc',
          textAlign: 'center',
          width: '150px'
        },
        position: { x: 275, y: 150 }
      },
      {
        type: 'paragraph',
        content: '• Pro feature 1\n• Pro feature 2\n• Pro feature 3\n• Pro feature 4',
        style: {
          fontSize: '14px',
          color: '#666',
          width: '150px',
          whiteSpace: 'pre-line'
        },
        position: { x: 275, y: 190 }
      },
      {
        type: 'button',
        content: 'Choose Plan',
        style: {
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          width: '120px',
          textAlign: 'center'
        },
        position: { x: 290, y: 300 }
      },
      // Enterprise Plan
      {
        type: 'container',
        content: 'Enterprise Plan',
        style: {
          width: '180px',
          height: '250px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #eee'
        },
        position: { x: 470, y: 100 }
      },
      {
        type: 'header',
        content: 'Enterprise',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          width: '150px'
        },
        position: { x: 485, y: 115 }
      },
      {
        type: 'header',
        content: '$49.99/mo',
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#0066cc',
          textAlign: 'center',
          width: '150px'
        },
        position: { x: 485, y: 150 }
      },
      {
        type: 'paragraph',
        content: '• Enterprise feature 1\n• Enterprise feature 2\n• Enterprise feature 3\n• Enterprise feature 4\n• Enterprise feature 5',
        style: {
          fontSize: '14px',
          color: '#666',
          width: '150px',
          whiteSpace: 'pre-line'
        },
        position: { x: 485, y: 190 }
      },
      {
        type: 'button',
        content: 'Choose Plan',
        style: {
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          width: '120px',
          textAlign: 'center'
        },
        position: { x: 500, y: 300 }
      }
    ]
  },
  'cta-banner': {
    name: 'CTA Banner',
    description: 'Call-to-action banner with heading and button',
    category: 'Content',
    thumbnail: '🔔',
    elements: [
      {
        type: 'container',
        content: 'CTA Container',
        style: {
          width: '600px',
          height: '120px',
          backgroundColor: '#0066cc',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        position: { x: 50, y: 50 }
      },
      {
        type: 'header',
        content: 'Ready to get started?',
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          width: '350px'
        },
        position: { x: 80, y: 70 }
      },
      {
        type: 'paragraph',
        content: 'Sign up now and get 30 days free trial',
        style: {
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.8)',
          width: '350px'
        },
        position: { x: 80, y: 105 }
      },
      {
        type: 'button',
        content: 'Sign Up Now',
        style: {
          backgroundColor: 'white',
          color: '#0066cc',
          padding: '12px 24px',
          borderRadius: '4px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        },
        position: { x: 470, y: 85 }
      }
    ]
  }
};

const ComponentLibrary = ({ onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories
  const categories = ['All', ...new Set(Object.values(componentTemplates).map(template => template.category))];
  
  // Filter templates based on search and category
  const filteredTemplates = Object.entries(componentTemplates).filter(([id, template]) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="component-library">
      <div className="library-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="templates-grid">
        {filteredTemplates.map(([id, template]) => (
          <div 
            key={id}
            className="template-card"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="template-thumbnail">
              <span className="thumbnail-icon">{template.thumbnail}</span>
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p className="template-description">{template.description}</p>
              <span className="template-category">{template.category}</span>
            </div>
          </div>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="no-results">
            <p>No templates found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentLibrary;
