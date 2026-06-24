import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  // Active form onboarding data tracking state properties
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStepSubmit = (e) => {
    e.preventDefault();
    console.log('Staging step 1 metadata: ', { fullName, nationalId, phoneNumber, emailAddress });
  };


  // ADD THIS FUNCTION
  const handleSignup = async (e) => {
  e.preventDefault(); // Stop page refresh
  setIsLoading(true);

  try {
// Ensure these variables match your state (e.g., formData.email, formData.password, etc.)
    const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        password,
        full_name: fullName,      // Must match backend schema
        national_id: nationalId,  // Must match backend schema
        phone_number: phoneNumber // Must match backend schema
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "/login"; // Force redirect to login
    } else {
      // Keep user on the page if it fails
      alert(data.detail || "Signup failed.");
      setIsLoading(false);
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Connection error.");
    setIsLoading(false);
  }
};



  return (
    <div className="container-fluid p-0 d-flex flex-column flex-md-row" style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      
      {/* 📝 LEFT PANE: MULTI-STEP INPUT FORM CONTAINER */}
      <div className="col-12 col-md-6 d-flex flex-column justify-content-between p-4 p-md-5 bg-white">
        
        {/* Brand Banner Top Row Sub-Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 text-primary mb-1">
            <i className="bi bi-wallet2 fs-4" style={{ color: '#092C4C' }}></i>
            <h4 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: '#092C4C' }}>MazaoSACCO</h4>
          </div>
          <span className="text-muted extra-small" style={{ fontSize: '0.8rem' }}>Securing your assets, compounding your growth.</span>
        </div>

        {/* Core Wizard Form Block Container */}
        <div className="mx-auto w-100" style={{ maxWidth: '420px', padding: '10px 0' }}>
          
          {/* Step Linear Progress Header Tracker Element */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-uppercase font-monospace fw-bold text-primary" style={{ fontSize: '0.72rem', letterSpacing: '0.04em', color: '#0B4687' }}>
                Step 1: Personal Details
              </span>
              <span className="text-muted small font-sans fw-medium" style={{ fontSize: '0.75rem' }}>33% Complete</span>
            </div>
            <div className="progress" style={{ height: '4px', backgroundColor: '#EFF6FF' }}>
              <div 
                className="progress-bar rounded-pill" 
                role="progressbar" 
                style={{ width: '33%', backgroundColor: '#2563EB' }} 
                aria-valuenow="33" 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="fw-bold text-dark tracking-tight mb-2" style={{ color: '#092C4C', fontSize: '2.1rem' }}>Create your account</h2>
            <p className="text-muted small lh-base">Enter your details exactly as they appear on your government-issued identification.</p>
          </div>

          {/* Registration Core Multi-Input Element Matrix Form Block */}
          <form onSubmit={handleSignup} className="d-flex flex-column gap-3">
            
            {/* Input Element Item 1: Full Name */}
            <div>
              <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Full Name</label>
              <div className="position-relative">
                <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                <input 
                  type="text" 
                  required
                  className="form-control bg-white ps-5 py-2.5 rounded-3 border"
                  style={{ fontSize: '0.9rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Input Element Item 2: National ID Number */}
            <div>
              <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>National ID Number</label>
              <div className="position-relative">
                <i className="bi bi-card-text position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                <input 
                  type="text" 
                  required
                  className="form-control bg-white ps-5 py-2.5 rounded-3 border"
                  style={{ fontSize: '0.9rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="8-digit ID number"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                />
              </div>
            </div>

            {/* Input Element Item 3: Phone Country Split Input Item */}
            <div>
              <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light bg-opacity-70 border-end-0 text-muted fw-medium px-3" style={{ fontSize: '0.9rem', borderColor: '#CBD5E1' }}>
                  +256
                </span>
                <input 
                  type="tel" 
                  required
                  className="form-control bg-white py-2.5 rounded-end-3 border"
                  style={{ fontSize: '0.9rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Input Element Item 4: Email Address */}
            <div>
              <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Email Address</label>
              <div className="position-relative">
                <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                <input 
                  type="email" 
                  required
                  className="form-control bg-white ps-5 py-2.5 rounded-3 border"
                  style={{ fontSize: '0.9rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Password</label>
              <div className="position-relative">
                <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                <input 
                  type="password" 
                  required
                  className="form-control bg-white ps-5 py-2.5 rounded-3 border"
                  style={{ fontSize: '0.9rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Forward Transit Stepper Action Button */}
            <button 
              type="submit" 
              className="btn text-white w-100 py-2.5 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 mt-3 border-0 shadow-sm"
              style={{ backgroundColor: '#092C4C' }}
            >
              Next Step <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          {/* Re-entry Transit Routing Anchor Node Link */}
          <div className="text-center mt-4">
            <span className="text-muted small">Already a member? </span>
            <button 
              type="button" 
              className="btn btn-link p-0 fw-bold small text-primary text-decoration-none" 
              style={{ color: '#2563EB' }}
              onClick={() => navigate('/login')}
            >
              Login here
            </button>
          </div>
        </div>

        {/* Lower Utility Policy Legal Strip links */}
        <div className="border-top pt-3 mt-4 d-flex justify-content-start gap-4 text-muted font-sans" style={{ fontSize: '0.72rem', fontWeight: '500' }}>
          <a href="#terms" className="text-decoration-none text-muted hover-text-dark">Terms of Service</a>
          <a href="#privacy" className="text-decoration-none text-muted hover-text-dark">Privacy Policy</a>
          <a href="#help" className="text-decoration-none text-muted hover-text-dark">Help Center</a>
        </div>

      </div>

      {/* 💳 RIGHT PANE: CORPORATE WEALTH THEMED SPLASH SIDE */}
      <div 
        className="col-12 col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-white position-relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(11, 22, 34, 0.8)), url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh'
        }}
      >
        <div></div>

        {/* Center Banner Messaging Value Text Component */}
        <div style={{ maxWidth: '480px', marginBottom: '20px' }}>
          <span className="text-uppercase tracking-widest font-monospace fw-bold extra-small text-muted d-block mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: '#CBD5E1' }}>
            Member Owned. Growth Focused.
          </span>
          <h1 className="fw-bold tracking-tight mb-4" style={{ fontSize: '3.2rem', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            Empowering the <br />
            pillars of <br />
            your success.
          </h1>
          <p className="opacity-90 lh-base" style={{ fontSize: '1rem', color: '#E2E8F0', fontWeight: '400' }}>
            Join over 45,000 members securing their corporate milestones and individual futures through high-yield savings plans and affordable development credit.
          </p>

          {/* Overlay Stat Metrics Feature Blocks */}
          <div className="d-flex gap-3 mt-5">
            {/* Stat Item Card Box 1 */}
            <div className="flex-grow-1 p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="text-info mb-2"><i className="bi bi-graph-up-arrow fs-5"></i></div>
              <h4 className="fw-bold mb-1" style={{ fontSize: '1.3rem' }}>8.5% PA</h4>
              <span className="text-muted extra-small d-block opacity-80" style={{ fontSize: '0.72rem' }}>Annual Dividend Returns</span>
            </div>

            {/* Stat Item Card Box 2 */}
            <div className="flex-grow-1 p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="text-info mb-2"><i className="bi bi-shield-check fs-5"></i></div>
              <h4 className="fw-bold mb-1" style={{ fontSize: '1.3rem' }}>Fully Secure</h4>
              <span className="text-muted extra-small d-block opacity-80" style={{ fontSize: '0.72rem' }}>Tier 1 Regulated SACCO</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}