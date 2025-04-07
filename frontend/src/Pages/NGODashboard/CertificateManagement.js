import React, { useState } from 'react';
import { Award, Download, Mail, Upload, QrCode, Search, Trash2, Edit, Plus } from 'lucide-react';
import './CertificateManagement.css';

// Mock certificate templates
const certificateTemplates = [
  { id: 1, name: 'Volunteer Appreciation', preview: '/api/placeholder/200/120' },
  { id: 2, name: 'Event Participation', preview: '/api/placeholder/200/120' },
  { id: 3, name: 'Training Completion', preview: '/api/placeholder/200/120' },
  { id: 4, name: 'Special Recognition', preview: '/api/placeholder/200/120' }
];

// Mock certificates
const mockCertificates = [
  { id: 101, recipient: 'John Smith', email: 'john@example.com', event: 'Beach Cleanup Drive', date: '2025-03-15', status: 'sent' },
  { id: 102, recipient: 'Anna Johnson', email: 'anna@example.com', event: 'Education Workshop', date: '2025-03-20', status: 'draft' },
  { id: 103, recipient: 'Mike Davis', email: 'mike@example.com', event: 'Food Distribution', date: '2025-03-25', status: 'sent' },
  { id: 104, recipient: 'Sarah Wilson', email: 'sarah@example.com', event: 'Tree Planting', date: '2025-04-01', status: 'draft' },
  { id: 105, recipient: 'Robert Brown', email: 'robert@example.com', event: 'Health Camp', date: '2025-04-05', status: 'sent' },
];

const CertificateManagement = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState(mockCertificates);

  // Filter certificates based on search term
  const filteredCertificates = certificates.filter(cert => 
    cert.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCertificate = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const handleSendCertificate = (id) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? {...cert, status: 'sent'} : cert
    ));
  };

  return (
    <div className="certificate-management">
      <div className="page-header">
        <h1>Certificate Management</h1>
        <p>Generate, track and verify certificates for your volunteers and events</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <Award size={18} />
          <span>Generate Certificates</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          <Edit size={18} />
          <span>Manage Issued</span>
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="generate-certificate">
          <div className="section">
            <h2>Select Template</h2>
            <div className="template-grid">
              {certificateTemplates.map(template => (
                <div 
                  key={template.id} 
                  className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <img src={template.preview} alt={template.name} />
                  <p>{template.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Certificate Details</h2>
            <div className="form-group">
              <label>Event</label>
              <select>
                <option value="">Select Event</option>
                <option value="1">Beach Cleanup Drive</option>
                <option value="2">Education Workshop</option>
                <option value="3">Food Distribution</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Certificate Title</label>
                <input type="text" placeholder="e.g. Certificate of Appreciation" />
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input type="date" />
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Recipients</h2>
            <div className="recipients-options">
              <div className="option">
                <h3>
                  <Plus size={16} />
                  Add Individually
                </h3>
                <div className="form-row">
                  <input type="text" placeholder="Name" />
                  <input type="email" placeholder="Email" />
                  <button className="add-btn">Add</button>
                </div>
              </div>
              <div className="option">
                <h3>
                  <Upload size={16} />
                  Batch Upload
                </h3>
                <button className="upload-btn">
                  <Upload size={16} />
                  Upload CSV File
                </button>
              </div>
            </div>
            <div className="recipients-list">
              <p>No recipients added yet</p>
            </div>
          </div>

          <div className="section">
            <h2>Additional Options</h2>
            <div className="options-list">
              <label className="checkbox-item">
                <input type="checkbox" checked={true} />
                <span>Include QR code for verification</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" checked={true} />
                <span>Auto-email certificates to recipients</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span>Add digital signature</span>
              </label>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn secondary">Save as Draft</button>
            <button className="btn primary">Generate Certificates</button>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="manage-certificates">
          <div className="filters">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by name or event..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-options">
              <select>
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
              </select>
              <select>
                <option value="all">All Events</option>
                <option value="1">Beach Cleanup Drive</option>
                <option value="2">Education Workshop</option>
                <option value="3">Food Distribution</option>
              </select>
            </div>
          </div>

          <div className="certificates-table">
            <div className="table-header">
              <div className="col">Recipient</div>
              <div className="col">Email</div>
              <div className="col">Event</div>
              <div className="col">Date</div>
              <div className="col">Status</div>
              <div className="col">Actions</div>
            </div>
            <div className="table-body">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map(cert => (
                  <div key={cert.id} className="table-row">
                    <div className="col">{cert.recipient}</div>
                    <div className="col">{cert.email}</div>
                    <div className="col">{cert.event}</div>
                    <div className="col">{new Date(cert.date).toLocaleDateString()}</div>
                    <div className="col">
                      <span className={`status-badge ${cert.status}`}>
                        {cert.status === 'sent' ? 'Sent' : 'Draft'}
                      </span>
                    </div>
                    <div className="col actions">
                      <button className="action-btn" title="Download">
                        <Download size={16} />
                      </button>
                      {cert.status === 'draft' && (
                        <button 
                          className="action-btn" 
                          title="Send Email"
                          onClick={() => handleSendCertificate(cert.id)}
                        >
                          <Mail size={16} />
                        </button>
                      )}
                      <button className="action-btn" title="QR Code">
                        <QrCode size={16} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Delete"
                        onClick={() => handleDeleteCertificate(cert.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No certificates found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;