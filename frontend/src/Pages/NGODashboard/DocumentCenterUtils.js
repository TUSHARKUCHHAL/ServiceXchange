// documentCentreUtils.js - Utility functions for the Document Centre component

/**
 * Format date to display in a user-friendly format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format file size to be more readable
 * @param {string} sizeString - Size string (e.g., "2.4 MB")
 * @returns {string} Formatted size with appropriate units
 */
export const formatFileSize = (sizeString) => {
  return sizeString; // Already formatted in our mock data
  
  // If handling numeric bytes, use this function instead:
  /*
  const bytes = parseInt(sizeBytes);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  */
};

/**
 * Sort documents by different properties
 * @param {Array} documents - Array of document objects
 * @param {string} sortBy - Property to sort by (title, date, size)
 * @param {boolean} ascending - Sort direction
 * @returns {Array} Sorted documents
 */
export const sortDocuments = (documents, sortBy = 'date', ascending = false) => {
  return [...documents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'size':
        // Extract numeric part for comparison
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        comparison = sizeA - sizeB;
        break;
      default:
        comparison = 0;
    }
    
    return ascending ? comparison : -comparison;
  });
};

/**
 * Filter documents by category and search term
 * @param {Array} documents - Array of document objects
 * @param {string} searchTerm - Search term to filter by
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered documents
 */
export const filterDocuments = (documents, searchTerm = '', category = 'all') => {
  return documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = category === 'all' || doc.category === category;
    
    return matchesSearch && matchesCategory;
  });
};

/**
 * Simulate document download (in real app, this would initiate actual download)
 * @param {number} docId - Document ID
 * @param {string} title - Document title
 * @returns {Promise} Promise that resolves when download is complete
 */
export const downloadDocument = (docId, title) => {
  return new Promise((resolve) => {
    console.log(`Downloading document: ${title} (ID: ${docId})`);
    
    // Simulate network delay
    setTimeout(() => {
      console.log(`Download complete: ${title}`);
      resolve({
        success: true,
        message: `${title} downloaded successfully!`
      });
    }, 1500);
  });
};

/**
 * Add animation class to document row
 * @param {number} docId - Document ID
 */
export const animateDocumentRow = (docId) => {
  const row = document.getElementById(`doc-row-${docId}`);
  if (row) {
    row.classList.add('doc-downloading');
    
    // Remove class after animation completes
    setTimeout(() => {
      row.classList.remove('doc-downloading');
    }, 1500);
  }
};