import React, { useState } from 'react';
import './CertificateVerification.css';

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call for certificate verification
    setTimeout(() => {
      if (!certificateId.trim()) {
        setError('Please enter a valid Certificate ID');
        setIsLoading(false);
        return;
      }
      
      // Mock verification logic - in a real app, this would be an API call
      const isValid = certificateId.length > 5 && issueDate;
      
      if (isValid) {
        setVerificationResult({
          valid: true,
          certificate: {
            id: certificateId,
            issueDate: issueDate || '2024-10-15',
            recipientName: 'John Doe',
            courseName: 'Community Development Program',
            issuedBy: 'NGO Connect',
            expiryDate: '2025-10-15'
          }
        });
      } else {
        setVerificationResult({
          valid: false,
          message: 'Certificate not found in our records. Please check the details and try again.'
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setCertificateId('');
    setIssueDate('');
    setVerificationResult(null);
    setError(null);
  };

  return (
    <div className="certificate-verification-container">
      <div className="verification-header">
        <h1>Certificate Verification</h1>
        <p>Verify the authenticity of certificates issued by NGO Connect</p>
      </div>

      <div className="verification-form-container">
        <form className="verification-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="certificateId">Certificate ID</label>
            <input
              type="text"
              id="certificateId"
              placeholder="Enter Certificate ID (e.g., NGO-2024-12345)"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="issueDate">Issue Date (Optional)</label>
            <input
              type="date"
              id="issueDate"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="submit" 
              className="verify-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Certificate'}
            </button>
            <button 
              type="button" 
              className="reset-btn" 
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Verifying certificate...</p>
        </div>
      )}

      {verificationResult && (
        <div className={`verification-result ${verificationResult.valid ? 'valid' : 'invalid'}`}>
          {verificationResult.valid ? (
            <>
              <div className="result-header">
                <div className="verification-badge">
                  <svg viewBox="0 0 24 24" className="checkmark">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <h2>Certificate Verified</h2>
              </div>
              <div className="certificate-details">
                <div className="detail-item">
                  <span className="detail-label">Certificate ID:</span>
                  <span className="detail-value">{verificationResult.certificate.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Recipient Name:</span>
                  <span className="detail-value">{verificationResult.certificate.recipientName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Course/Program:</span>
                  <span className="detail-value">{verificationResult.certificate.courseName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Issued By:</span>
                  <span className="detail-value">{verificationResult.certificate.issuedBy}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Issue Date:</span>
                  <span className="detail-value">{verificationResult.certificate.issueDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expiry Date:</span>
                  <span className="detail-value">{verificationResult.certificate.expiryDate}</span>
                </div>
              </div>
              <button className="download-btn">Download Certificate</button>
            </>
          ) : (
            <>
              <div className="result-header">
                <div className="verification-badge invalid">
                  <svg viewBox="0 0 24 24" className="cross">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </div>
                <h2>Certificate Not Verified</h2>
              </div>
              <p className="invalid-message">{verificationResult.message}</p>
              <button className="retry-btn" onClick={handleReset}>Try Again</button>
            </>
          )}
        </div>
      )}

      <div className="verification-info">
        <h3>How to verify your certificate?</h3>
        <ol>
          <li>Enter the Certificate ID found on your certificate</li>
          <li>Optionally, enter the issue date for faster verification</li>
          <li>Click "Verify Certificate" to check authenticity</li>
        </ol>

        <h3>Why verify your certificate?</h3>
        <p>Verification ensures that your certificate was legitimately issued by NGO Connect and hasn't been altered. Employers and institutions can verify your achievements easily.</p>
      </div>
    </div>
  );
};

export default CertificateVerification;