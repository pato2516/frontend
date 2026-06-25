import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  Percent, 
  Save, 
  RefreshCw 
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('loans');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- State Core Management ---
  const [loanSettings, setLoanSettings] = useState({
    minAmount: 1000,
    maxAmount: 50000,
    defaultInterestRate: 5.5,
    maxTermMonths: 60,
    autoApproveCreditScore: 750,
    requireManualReviewBelow: 600,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeoutMinutes: 30,
    twoFactorRequired: true,
    maxLoginAttempts: 5,
    allowedIpWhitelist: '',
  });

  const [verificationSettings, setVerificationSettings] = useState({
    requireNationalIdScan: true,
    requirePayslipVerification: true,
    autoRejectBlacklistedUsers: true,
  });

  // --- Handlers ---
  const handleInputChange = (section, field, value) => {
    const parsedValue = typeof value === 'string' && !isNaN(value) && value !== '' ? Number(value) : value;
    
    if (section === 'loans') {
      setLoanSettings(prev => ({ ...prev, [field]: parsedValue }));
    } else if (section === 'security') {
      setSecuritySettings(prev => ({ ...prev, [field]: parsedValue }));
    } else if (section === 'verification') {
      setVerificationSettings(prev => ({ ...prev, [field]: parsedValue }));
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        loan_rules: loanSettings,
        security_config: securitySettings,
        verification_rules: verificationSettings,
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Configuration architecture saved successfully!');
    } catch (error) {
      showToast('Failed to update system settings core.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-light min-vh-screen py-5">
      <div className="container max-w-xxl">
        
        {/* Toast Alert Banner */}
        {toast.show && (
          <div 
            className={`position-fixed top-0 end-0 m-4 z-30 alert alert-${toast.type === 'success' ? 'success' : 'danger'} shadow-lg border-0 d-flex align-items-center`} 
            style={{ zIndex: 1050 }}
            role="alert"
          >
            <div>{toast.message}</div>
          </div>
        )}

        {/* Header Block */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <div>
            <h1 className="fw-bold text-dark mb-1">System Configurations</h1>
            <p className="text-muted small mb-0">Manage global system parameters, risk constraints, and security definitions.</p>
          </div>
          <div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 shadow-sm"
            >
              {isSaving ? <RefreshCw className="spinner-border spinner-border-sm border-0 animate-spin" style={{animationDuration: '1s'}} /> : <Save size={18} />}
              {isSaving ? 'Saving Changes...' : 'Save System Settings'}
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="row g-4">
          
          {/* Navigation Sidebar */}
          <div className="col-12 col-md-3">
            <div className="list-group shadow-sm bg-white border rounded-3 p-2">
              <button
                onClick={() => setActiveTab('loans')}
                className={`list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 py-3 ${
                  activeTab === 'loans' ? 'active bg-primary text-white' : 'text-secondary'
                }`}
              >
                <Percent size={18} className="flex-shrink-0" />
                <span>Loan Parameters</span>
              </button>
              
              <button
                onClick={() => setActiveTab('verification')}
                className={`list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 py-3 ${
                  activeTab === 'verification' ? 'active bg-primary text-white' : 'text-secondary'
                }`}
              >
                <UserCheck size={18} className="flex-shrink-0" />
                <span>User Verification</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`list-group-item list-group-item-action border-0 rounded-3 d-flex align-items-center gap-3 py-3 ${
                  activeTab === 'security' ? 'active bg-primary text-white' : 'text-secondary'
                }`}
              >
                <ShieldAlert size={18} className="flex-shrink-0" />
                <span>Security & Controls</span>
              </button>
            </div>
          </div>

          {/* Form Settings Panel */}
          <div className="col-12 col-md-9">
            <div className="card shadow-sm border rounded-3 bg-white">
              <form onSubmit={handleSave} className="card-body p-4 p-md-5">
                
                {/* 1. LOAN PARAMETERS TAB */}
                {activeTab === 'loans' && (
                  <div className="d-flex flex-column gap-4">
                    <SectionHeader title="Loan Parameter Engine" description="Define limits and risk thresholds for automated system decisions." />
                    
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Minimum Limit ($)" 
                          type="number" 
                          value={loanSettings.minAmount} 
                          onChange={(val) => handleInputChange('loans', 'minAmount', val)} 
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Maximum Limit ($)" 
                          type="number" 
                          value={loanSettings.maxAmount} 
                          onChange={(val) => handleInputChange('loans', 'maxAmount', val)} 
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Base Annual Interest Rate (%)" 
                          type="number" 
                          step="0.01" 
                          value={loanSettings.defaultInterestRate} 
                          onChange={(val) => handleInputChange('loans', 'defaultInterestRate', val)} 
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Maximum Term Allowance (Months)" 
                          type="number" 
                          value={loanSettings.maxTermMonths} 
                          onChange={(val) => handleInputChange('loans', 'maxTermMonths', val)} 
                        />
                      </div>
                    </div>

                    <div className="border-top pt-4 row g-3">
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Auto-Approval Credit Threshold" 
                          type="number" 
                          value={loanSettings.autoApproveCreditScore} 
                          onChange={(val) => handleInputChange('loans', 'autoApproveCreditScore', val)} 
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Minimum Hard Rejection Credit Score" 
                          type="number" 
                          value={loanSettings.requireManualReviewBelow} 
                          onChange={(val) => handleInputChange('loans', 'requireManualReviewBelow', val)} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. USER VERIFICATION TAB */}
                {activeTab === 'verification' && (
                  <div className="d-flex flex-column gap-4">
                    <SectionHeader title="Verification Checklist Guards" description="Specify verification enforcement policies for incoming applications." />
                    
                    <div className="d-flex flex-column gap-2">
                      <FormToggle 
                        id="verifyIdScan"
                        label="Enforce Global National ID Scans" 
                        description="Requires users to upload clean valid regulatory documents prior to matching application limits."
                        checked={verificationSettings.requireNationalIdScan}
                        onChange={(val) => handleInputChange('verification', 'requireNationalIdScan', val)}
                      />
                      <FormToggle 
                        id="verifyPayslip"
                        label="Require Explicit Income/Payslip Verification" 
                        description="Forces system to flag requests for documentation if salary metrics cannot be confirmed instantly."
                        checked={verificationSettings.requirePayslipVerification}
                        onChange={(val) => handleInputChange('verification', 'requirePayslipVerification', val)}
                      />
                      <FormToggle 
                        id="autoReject"
                        label="Auto-Reject System Blacklists" 
                        description="Instantly rejects applicants matching historical system-wide risk markers."
                        checked={verificationSettings.autoRejectBlacklistedUsers}
                        onChange={(val) => handleInputChange('verification', 'autoRejectBlacklistedUsers', val)}
                      />
                    </div>
                  </div>
                )}

                {/* 3. SECURITY & CONTROLS TAB */}
                {activeTab === 'security' && (
                  <div className="d-flex flex-column gap-4">
                    <SectionHeader title="Authentication & Audit Limits" description="Enforce global operational compliance metrics to safeguard access." />
                    
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Admin Max Session Timeout (Minutes)" 
                          type="number" 
                          value={securitySettings.sessionTimeoutMinutes} 
                          onChange={(val) => handleInputChange('security', 'sessionTimeoutMinutes', val)} 
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <FormInput 
                          label="Max Bad Login Attempts Before Lockout" 
                          type="number" 
                          value={securitySettings.maxLoginAttempts} 
                          onChange={(val) => handleInputChange('security', 'maxLoginAttempts', val)} 
                        />
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-4 border-top pt-4">
                      <FormToggle 
                        id="mfaToggle"
                        label="Enforce Multi-Factor Authentication (MFA)" 
                        description="Mandates MFA verification across all accounts with administrative or officer roles."
                        checked={securitySettings.twoFactorRequired}
                        onChange={(val) => handleInputChange('security', 'twoFactorRequired', val)}
                      />
                      
                      <div className="form-group">
                        <label className="form-label text-uppercase text-muted fw-bold small tracking-wider mb-2">Corporate IP Range Whitelist</label>
                        <textarea
                          placeholder="e.g., 192.168.1.1, 10.0.0.0/24 (Leave blank to allow any access)"
                          rows={3}
                          value={securitySettings.allowedIpWhitelist}
                          onChange={(e) => handleInputChange('security', 'allowedIpWhitelist', e.target.value)}
                          className="form-control text-monospace bg-light"
                          style={{ fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Presentation Layout Components ---

function SectionHeader({ title, description }) {
  return (
    <div className="border-b pb-3 mb-2">
      <h3 className="h5 fw-bold text-dark mb-1">{title}</h3>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div className="form-group">
      <label className="form-label text-uppercase text-muted fw-bold small mb-2">{label}</label>
      <input
        {...props}
        className="form-control py-2 shadow-sm-sm"
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}

function FormToggle({ id, label, description, checked, onChange }) {
  return (
    <div className="d-flex justify-content-between align-items-start p-3 rounded-3 list-group-item-action gap-3">
      <div>
        <label htmlFor={id} className="form-label fw-bold mb-0 text-dark d-block" style={{ cursor: 'pointer' }}>
          {label}
        </label>
        <span className="text-muted small d-block" style={{ maxWidth: '540px' }}>
          {description}
        </span>
      </div>
      <div className="form-check form-switch fs-4 p-0 m-0 d-flex align-items-center">
        <input
          id={id}
          type="checkbox"
          className="form-check-input m-0 cursor-pointer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}