import React, { useState, useEffect } from 'react';
import './DocumentCenter.css';

const DocumentCentre = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Simulated document data - replace with your actual API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setDocuments([
        { id: 1, title: 'NGO Partnership Guidelines', category: 'guidelines', date: '2025-03-15', size: '2.4 MB' },
        { id: 2, title: 'Volunteer Registration Form', category: 'forms', date: '2025-02-28', size: '1.1 MB' },
        { id: 3, title: 'Funding Request Template', category: 'templates', date: '2025-03-10', size: '1.8 MB' },
        { id: 4, title: 'Annual Impact Report 2024', category: 'reports', date: '2025-01-20', size: '4.6 MB' },
        { id: 5, title: 'Community Outreach Handbook', category: 'guidelines', date: '2025-03-01', size: '3.2 MB' },
        { id: 6, title: 'Project Proposal Template', category: 'templates', date: '2025-02-15', size: '2.1 MB' },
        { id: 7, title: 'Regional NGO Directory', category: 'reports', date: '2025-03-22', size: '5.8 MB' },
        { id: 8, title: 'Donation Receipt Form', category: 'forms', date: '2025-02-10', size: '0.8 MB' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Document categories
  const categories = [
    { id: 'all', name: 'All Documents' },
    { id: 'forms', name: 'Forms' },
    { id: 'templates', name: 'Templates' },
    { id: 'reports', name: 'Reports' },
    { id: 'guidelines', name: 'Guidelines' }
  ];

  // Handle document download (simulated)
  const handleDownload = (docId) => {
    // Actual implementation would initiate a download
    console.log(`Downloading document ${docId}`);
    
    // Add the animation class to the document row
    const row = document.getElementById(`doc-row-${docId}`);
    row.classList.add('doc-downloading');
    
    // Remove the class after animation completes
    setTimeout(() => {
      row.classList.remove('doc-downloading');
    }, 1500);
  };

  return (
    <div className="doc-centre-container">
      <div className="doc-header">
        <h1>Document Centre</h1>
        <p>Access all resources, forms, and reports for NGO partnerships</p>
      </div>

      <div className="doc-controls">
        <div className="doc-search">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="doc-search-input"
          />
          {searchTerm && (
            <button 
              className="doc-search-clear" 
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="doc-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`doc-category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="doc-content">
        {isLoading ? (
          <div className="doc-loading">
            <div className="doc-loading-spinner"></div>
            <p>Loading documents...</p>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="doc-table-container">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date Added</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} id={`doc-row-${doc.id}`} className="doc-item">
                    <td className="doc-title">{doc.title}</td>
                    <td>
                      <span className={`doc-category doc-category-${doc.category}`}>
                        {doc.category}
                      </span>
                    </td>
                    <td>{doc.date}</td>
                    <td>{doc.size}</td>
                    <td>
                      <button 
                        className="doc-download-btn"
                        onClick={() => handleDownload(doc.id)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="doc-empty">
            <div className="doc-empty-icon">📄</div>
            <p>No documents found matching your criteria</p>
            <button 
              className="doc-reset-btn"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCentre;