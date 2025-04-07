import React, { useState, useRef } from 'react';
import { 
  Award, Download, Mail, Upload, QrCode, Search, 
  Trash2, Edit, Plus, Eye, Printer, CheckCircle, Save
} from 'lucide-react';
import './CertificateManagement.css';

// Certificate templates with preview images
const certificateTemplates = [
  { 
    id: 1, 
    name: 'Volunteer Appreciation', 
    preview: '/api/placeholder/200/120',
    template: (data) => `
      <div class="certificate volunteer-appreciation">
        <div class="certificate-header">
          <div class="certificate-logo">${data.organizationName || 'Organization Name'}</div>
          <h1>Certificate of Appreciation</h1>
        </div>
        <div class="certificate-content">
          <p class="certificate-text">This is to certify that</p>
          <p class="recipient-name">${data.recipientName}</p>
          <p class="certificate-text">has volunteered at</p>
          <p class="event-name">${data.eventName}</p>
          <p class="certificate-text">On ${new Date(data.issueDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
        </div>
        <div class="certificate-footer">
          <div class="signature">
            <div class="signature-line"></div>
            <p>Director</p>
          </div>
          ${data.includeQr ? '<div class="qr-code"><img src="/api/placeholder/80/80" alt="QR Code" /></div>' : ''}
        </div>
      </div>
    `
  },
  { 
    id: 2, 
    name: 'Event Participation', 
    preview: '/api/placeholder/200/120',
    template: (data) => `
      <div class="certificate event-participation">
        <div class="certificate-header">
          <div class="certificate-logo">${data.organizationName || 'Organization Name'}</div>
          <h1>Certificate of Participation</h1>
        </div>
        <div class="certificate-content">
          <p class="certificate-text">This certifies that</p>
          <p class="recipient-name">${data.recipientName}</p>
          <p class="certificate-text">has participated in</p>
          <p class="event-name">${data.eventName}</p>
          <p class="certificate-text">held on ${new Date(data.issueDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
        </div>
        <div class="certificate-footer">
          <div class="signature">
            <div class="signature-line"></div>
            <p>Event Coordinator</p>
          </div>
          ${data.includeQr ? '<div class="qr-code"><img src="/api/placeholder/80/80" alt="QR Code" /></div>' : ''}
        </div>
      </div>
    `
  },
  { 
    id: 3, 
    name: 'Training Completion', 
    preview: '/api/placeholder/200/120',
    template: (data) => `
      <div class="certificate training-completion">
        <div class="certificate-header">
          <div class="certificate-logo">${data.organizationName || 'Organization Name'}</div>
          <h1>Certificate of Completion</h1>
        </div>
        <div class="certificate-content">
          <p class="certificate-text">This is to certify that</p>
          <p class="recipient-name">${data.recipientName}</p>
          <p class="certificate-text">has successfully completed the training program</p>
          <p class="event-name">${data.eventName}</p>
          <p class="certificate-text">on ${new Date(data.issueDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
        </div>
        <div class="certificate-footer">
          <div class="signature">
            <div class="signature-line"></div>
            <p>Training Director</p>
          </div>
          ${data.includeQr ? '<div class="qr-code"><img src="/api/placeholder/80/80" alt="QR Code" /></div>' : ''}
        </div>
      </div>
    `
  },
  { 
    id: 4, 
    name: 'Special Recognition', 
    preview: '/api/placeholder/200/120',
    template: (data) => `
      <div class="certificate special-recognition">
        <div class="certificate-header">
          <div class="certificate-logo">${data.organizationName || 'Organization Name'}</div>
          <h1>Special Recognition</h1>
        </div>
        <div class="certificate-content">
          <p class="certificate-text">This award recognizes</p>
          <p class="recipient-name">${data.recipientName}</p>
          <p class="certificate-text">for exceptional contribution to</p>
          <p class="event-name">${data.eventName}</p>
          <p class="certificate-text">Awarded on ${new Date(data.issueDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
        </div>
        <div class="certificate-footer">
          <div class="signature">
            <div class="signature-line"></div>
            <p>President</p>
          </div>
          ${data.includeQr ? '<div class="qr-code"><img src="/api/placeholder/80/80" alt="QR Code" /></div>' : ''}
        </div>
      </div>
    `
  }
];

// Mock events
const events = [
  { id: 1, name: 'Beach Cleanup Drive', date: '2025-03-15' },
  { id: 2, name: 'Education Workshop', date: '2025-03-20' },
  { id: 3, name: 'Food Distribution', date: '2025-03-25' },
  { id: 4, name: 'Tree Planting', date: '2025-04-01' },
  { id: 5, name: 'Health Camp', date: '2025-04-05' },
];

// Mock certificates
const mockCertificates = [
  { id: 101, recipient: 'John Smith', email: 'john@example.com', event: 'Beach Cleanup Drive', date: '2025-03-15', status: 'sent', templateId: 1 },
  { id: 102, recipient: 'Anna Johnson', email: 'anna@example.com', event: 'Education Workshop', date: '2025-03-20', status: 'draft', templateId: 2 },
  { id: 103, recipient: 'Mike Davis', email: 'mike@example.com', event: 'Food Distribution', date: '2025-03-25', status: 'sent', templateId: 3 },
  { id: 104, recipient: 'Sarah Wilson', email: 'sarah@example.com', event: 'Tree Planting', date: '2025-04-01', status: 'draft', templateId: 1 },
  { id: 105, recipient: 'Robert Brown', email: 'robert@example.com', event: 'Health Camp', date: '2025-04-05', status: 'sent', templateId: 4 },
];

const CertificateManagement = () => {
  // State
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [certificates, setCertificates] = useState(mockCertificates);
  const [recipients, setRecipients] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    eventId: '',
    certificateTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    recipientName: '',
    recipientEmail: '',
    organizationName: 'Community Connect',
    includeQr: true,
    autoEmail: true,
    addSignature: false
  });
  
  // Ref for certificate preview
  const certificatePreviewRef = useRef(null);
  
  // Filter certificates based on search term and filters
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cert.event.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    const matchesEvent = eventFilter === 'all' || cert.event === events.find(e => e.id === parseInt(eventFilter))?.name;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });
  
  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Add recipient
  const handleAddRecipient = () => {
    if (!formData.recipientName || !formData.recipientEmail) {
      showNotification('Please enter recipient name and email', 'error');
      return;
    }
    
    const newRecipient = {
      id: Date.now(),
      name: formData.recipientName,
      email: formData.recipientEmail
    };
    
    setRecipients([...recipients, newRecipient]);
    setFormData({
      ...formData,
      recipientName: '',
      recipientEmail: ''
    });
    
    showNotification('Recipient added successfully', 'success');
  };
  
  // Remove recipient
  const handleRemoveRecipient = (id) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Simulate CSV parsing
    setTimeout(() => {
      const newRecipients = [
        { id: Date.now(), name: 'James Wilson', email: 'james@example.com' },
        { id: Date.now() + 1, name: 'Maria Garcia', email: 'maria@example.com' },
        { id: Date.now() + 2, name: 'Alex Johnson', email: 'alex@example.com' }
      ];
      
      setRecipients([...recipients, ...newRecipients]);
      showNotification('CSV uploaded successfully. 3 recipients added.', 'success');
    }, 1000);
  };
  
  // Delete certificate
  const handleDeleteCertificate = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    showNotification('Certificate deleted successfully', 'success');
  };
  
  // Send certificate
  const handleSendCertificate = (id) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? {...cert, status: 'sent'} : cert
    ));
    showNotification('Certificate sent successfully', 'success');
  };
  
  // Generate certificates
  const handleGenerateCertificates = () => {
    if (!selectedTemplate) {
      showNotification('Please select a template', 'error');
      return;
    }
    
    if (!formData.eventId) {
      showNotification('Please select an event', 'error');
      return;
    }
    
    if (recipients.length === 0) {
      showNotification('Please add at least one recipient', 'error');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate certificate generation
    setTimeout(() => {
      const event = events.find(e => e.id === parseInt(formData.eventId));
      
      const newCertificates = recipients.map(recipient => ({
        id: Date.now() + recipient.id,
        recipient: recipient.name,
        email: recipient.email,
        event: event.name,
        date: formData.issueDate,
        status: formData.autoEmail ? 'sent' : 'draft',
        templateId: selectedTemplate
      }));
      
      setCertificates([...certificates, ...newCertificates]);
      setRecipients([]);
      setIsLoading(false);
      showNotification(`${newCertificates.length} certificates generated successfully`, 'success');
      setActiveTab('manage');
    }, 1500);
  };
  
  // Save as draft
  const handleSaveDraft = () => {
    showNotification('Draft saved successfully', 'success');
  };
  
  // Show preview
  const handleShowPreview = () => {
    if (!selectedTemplate) {
      showNotification('Please select a template first', 'error');
      return;
    }
    
    setShowPreview(true);
  };
  
  // Print certificate
  const handlePrintCertificate = (certificate) => {
    const template = certificateTemplates.find(t => t.id === certificate.templateId);
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.recipient}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .certificate { width: 800px; height: 600px; margin: 0 auto; padding: 40px; border: 15px solid #e74c3c; position: relative; }
          .certificate-header { text-align: center; margin-bottom: 40px; }
          .certificate-logo { font-size: 18px; font-weight: bold; color: #e74c3c; margin-bottom: 10px; }
          .certificate-header h1 { font-size: 36px; color: #333; margin: 0; }
          .certificate-content { text-align: center; margin-bottom: 40px; }
          .certificate-text { font-size: 18px; margin: 10px 0; }
          .recipient-name { font-size: 32px; font-weight: bold; color: #e74c3c; margin: 15px 0; }
          .event-name { font-size: 24px; font-weight: bold; margin: 15px 0; }
          .certificate-footer { display: flex; justify-content: space-between; margin-top: 60px; }
          .signature { text-align: center; flex: 1; }
          .signature-line { width: 200px; height: 1px; background: #000; margin: 0 auto 10px; }
          .qr-code { width: 80px; height: 80px; }
          @media print { @page { size: landscape; } }
        </style>
      </head>
      <body>
        ${template.template({
          recipientName: certificate.recipient,
          eventName: certificate.event,
          issueDate: certificate.date,
          organizationName: 'Community Connect',
          includeQr: true
        })}
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };
  
  // Show QR code
  const handleShowQrCode = (certificate) => {
    // Simulate QR code display
    alert(`QR code for certificate #${certificate.id} - ${certificate.recipient}`);
  };
  
  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Get selected template
  const getSelectedTemplateData = () => certificateTemplates.find(t => t.id === selectedTemplate);
  
  // Get event name
  const getEventName = () => {
    const event = events.find(e => e.id === parseInt(formData.eventId));
    return event ? event.name : '';
  };

  return (
    <div className="certificate-management">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle size={18} />}
          {notification.type === 'error' && <Trash2 size={18} />}
          <span>{notification.message}</span>
        </div>
      )}
      
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
            <div className="section-header">
              <h2>Select Template</h2>
              <button className="preview-btn" onClick={handleShowPreview} disabled={!selectedTemplate}>
                <Eye size={16} />
                Preview
              </button>
            </div>
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
              <select 
                name="eventId" 
                value={formData.eventId} 
                onChange={handleFormChange}
              >
                <option value="">Select Event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Certificate Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Certificate of Appreciation" 
                  name="certificateTitle"
                  value={formData.certificateTitle}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input 
                  type="date" 
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Organization Name</label>
              <input 
                type="text" 
                placeholder="Your organization name" 
                name="organizationName"
                value={formData.organizationName}
                onChange={handleFormChange}
              />
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
                  <input 
                    type="text" 
                    placeholder="Name" 
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleFormChange}
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    name="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={handleFormChange}
                  />
                  <button className="add-btn" onClick={handleAddRecipient}>Add</button>
                </div>
              </div>
              <div className="option">
                <h3>
                  <Upload size={16} />
                  Batch Upload
                </h3>
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="csv-upload" className="upload-btn">
                  <Upload size={16} />
                  Upload CSV File
                </label>
              </div>
            </div>
            <div className={`recipients-list ${recipients.length > 0 ? 'has-recipients' : ''}`}>
              {recipients.length > 0 ? (
                <table className="recipients-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map(recipient => (
                      <tr key={recipient.id}>
                        <td>{recipient.name}</td>
                        <td>{recipient.email}</td>
                        <td>
                          <button 
                            className="action-btn delete" 
                            onClick={() => handleRemoveRecipient(recipient.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recipients added yet</p>
              )}
            </div>
          </div>

          <div className="section">
            <h2>Additional Options</h2>
            <div className="options-list">
              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="includeQr"
                  checked={formData.includeQr}
                  onChange={handleFormChange}
                />
                <span>Include QR code for verification</span>
              </label>
              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="autoEmail"
                  checked={formData.autoEmail}
                  onChange={handleFormChange}
                />
                <span>Auto-email certificates to recipients</span>
              </label>
              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="addSignature"
                  checked={formData.addSignature}
                  onChange={handleFormChange}
                />
                <span>Add digital signature</span>
              </label>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn secondary" onClick={handleSaveDraft}>
              <Save size={16} />
              Save as Draft
            </button>
            <button 
              className={`btn primary ${isLoading ? 'loading' : ''}`} 
              onClick={handleGenerateCertificates}
              disabled={isLoading}
            >
              <Award size={16} />
              {isLoading ? 'Generating...' : 'Generate Certificates'}
            </button>
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
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
              </select>
              <select 
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
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
                      <button 
                        className="action-btn" 
                        title="Print"
                        onClick={() => handlePrintCertificate(cert)}
                      >
                        <Printer size={16} />
                      </button>
                      <button 
                        className="action-btn" 
                        title="Download"
                      >
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
                      <button 
                        className="action-btn" 
                        title="QR Code"
                        onClick={() => handleShowQrCode(cert)}
                      >
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

      {showPreview && (
        <div className="certificate-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="certificate-preview" onClick={e => e.stopPropagation()} ref={certificatePreviewRef}>
            <div className="preview-header">
              <h2>Certificate Preview</h2>
              <button className="close-btn" onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <div className="preview-content">
              <div 
                className="certificate-container"
                dangerouslySetInnerHTML={{ 
                  __html: getSelectedTemplateData()?.template({
                    recipientName: formData.recipientName || 'Recipient Name',
                    eventName: getEventName() || 'Event Name',
                    issueDate: formData.issueDate,
                    organizationName: formData.organizationName,
                    includeQr: formData.includeQr
                  }) 
                }}
              />
            </div>
            <div className="preview-actions">
              <button className="btn secondary" onClick={() => setShowPreview(false)}>Close</button>
              <button className="btn primary">
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;