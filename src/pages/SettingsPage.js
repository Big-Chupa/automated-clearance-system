import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { storageService } from '../services/storageService';

const SettingsPage = () => {
  const [settings, setSettings] = useState(storageService.getSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-content">
          <div className="breadcrumb-trail">Home / System Settings</div>
          <div className="page-header-row">
            <div>
              <h1 className="page-main-heading">System Settings</h1>
              <p className="page-sub-heading">
                Configure prototype defaults, notifications and clearance workflow.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div style={{
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              border: '1px solid #a7f3d0'
            }}>
              ✓ System settings saved successfully.
            </div>
          )}

          <div className="settings-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left Card: General Settings */}
            <div className="content-card">
              <h2 className="card-heading-title">General Settings</h2>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <div className="toggle-title">Enable new student registration</div>
                  <div className="toggle-desc">Allow graduating students to create clearance accounts.</div>
                </div>
                <label className="switch-control">
                  <input
                    type="checkbox"
                    checked={settings.enableRegistration}
                    onChange={() => handleToggle('enableRegistration')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <div className="toggle-title">Email-style in-app notifications</div>
                  <div className="toggle-desc">Create a notification when an approval decision is recorded.</div>
                </div>
                <label className="switch-control">
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotifications}
                    onChange={() => handleToggle('enableEmailNotifications')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <div className="toggle-title">Allow certificate printing</div>
                  <div className="toggle-desc">Available only after all required units approve the request.</div>
                </div>
                <label className="switch-control">
                  <input
                    type="checkbox"
                    checked={settings.allowCertificatePrinting}
                    onChange={() => handleToggle('allowCertificatePrinting')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <div className="toggle-title">Maintenance mode</div>
                  <div className="toggle-desc">Temporarily prevent non-admin users from accessing the portal.</div>
                </div>
                <label className="switch-control">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={() => handleToggle('maintenanceMode')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>

            {/* Right Card: Prototype Information */}
            <div className="content-card">
              <h2 className="card-heading-title">Prototype Information</h2>

              <form onSubmit={handleSave}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={settings.institution}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Academic Session
                  </label>
                  <input
                    type="text"
                    name="academicSession"
                    value={settings.academicSession}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Storage Mode
                  </label>
                  <input
                    type="text"
                    name="storageMode"
                    value={settings.storageMode}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Session Timeout
                  </label>
                  <select
                    name="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={handleChange}
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-pill-maroon btn-block"
                  style={{ padding: '0.65rem' }}
                >
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
