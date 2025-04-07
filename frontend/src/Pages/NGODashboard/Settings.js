import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  // State for different settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    contactInfoVisibility: 'connections',
    activityStatus: true
  });
  
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [savedMessage, setSavedMessage] = useState('');
  
  // Toggle notification settings
  const toggleNotification = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
  };
  
  // Handle privacy setting changes
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: value
    });
  };
  
  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
  
  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  
  // Save all settings
  const saveSettings = () => {
    // In a real app, you would save to backend here
    console.log("Saving settings:", {
      notifications,
      privacySettings,
      theme,
      language
    });
    
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => {
      setSavedMessage('');
    }, 3000);
  };
  
  // Handle account deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // In a real app, you would connect to backend API here
      console.log("Account deletion request submitted");
      alert("Account deletion process initiated. You will receive an email with further instructions.");
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };
  
  return (
    <div className="settings-container">
      <h1 className="settings-title">Account Settings</h1>
      
      {savedMessage && (
        <div className="settings-saved-message">
          {savedMessage}
        </div>
      )}
      
      <div className="settings-section">
        <h2>Notification Preferences</h2>
        <div className="settings-option">
          <label>
            <span>Email Notifications</span>
            <div 
              className={`toggle-switch ${notifications.email ? 'active' : ''}`}
              onClick={() => toggleNotification('email')}
            >
              <div className="toggle-switch-circle"></div>
            </div>
          </label>
        </div>
        
        <div className="settings-option">
          <label>
            <span>SMS Notifications</span>
            <div 
              className={`toggle-switch ${notifications.sms ? 'active' : ''}`}
              onClick={() => toggleNotification('sms')}
            >
              <div className="toggle-switch-circle"></div>
            </div>
          </label>
        </div>
        
        <div className="settings-option">
          <label>
            <span>Push Notifications</span>
            <div 
              className={`toggle-switch ${notifications.push ? 'active' : ''}`}
              onClick={() => toggleNotification('push')}
            >
              <div className="toggle-switch-circle"></div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Privacy Settings</h2>
        <div className="settings-option">
          <label>
            <span>Profile Visibility</span>
            <select 
              value={privacySettings.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
        
        <div className="settings-option">
          <label>
            <span>Contact Information Visibility</span>
            <select 
              value={privacySettings.contactInfoVisibility}
              onChange={(e) => handlePrivacyChange('contactInfoVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
        
        <div className="settings-option">
          <label>
            <span>Show Activity Status</span>
            <div 
              className={`toggle-switch ${privacySettings.activityStatus ? 'active' : ''}`}
              onClick={() => handlePrivacyChange('activityStatus', !privacySettings.activityStatus)}
            >
              <div className="toggle-switch-circle"></div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="theme-options">
          <div 
            className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            <div className="theme-preview light-theme"></div>
            <span>Light</span>
          </div>
          
          <div 
            className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="theme-preview dark-theme"></div>
            <span>Dark</span>
          </div>
          
          <div 
            className={`theme-option ${theme === 'high-contrast' ? 'selected' : ''}`}
            onClick={() => handleThemeChange('high-contrast')}
          >
            <div className="theme-preview high-contrast-theme"></div>
            <span>High Contrast</span>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Language</h2>
        <div className="settings-option">
          <label>
            <span>Select Language</span>
            <select value={language} onChange={handleLanguageChange}>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="hindi">Hindi</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="settings-section danger-zone">
        <h2>Account Management</h2>
        <div className="danger-zone-content">
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          {showDeleteConfirm ? (
            <div className="delete-confirmation">
              <p>Are you sure you want to permanently delete your account?</p>
              <div className="delete-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="delete-button"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="delete-account-button"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="cancel-button">Cancel</button>
        <button className="save-button" onClick={saveSettings}>Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;