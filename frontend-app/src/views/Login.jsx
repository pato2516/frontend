import React, { useState } from 'react';
import{ jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';





export default function Login() {

  
  // State tracking variables
  //const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



// Ensure you have this installed

// Ensure you have this installed

// ... inside your component
const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      // 1. Store token securely
      localStorage.setItem("token", data.access_token);
      
      // 2. Decode token to get user metadata
      const user = jwtDecode(data.access_token);
      
      // 3. Navigate using react-router-dom (prevents page reload)
      if (user.role === 'admin') {
        navigate('/app/admin');
      } else {
        navigate('/app/dashboard');
      }
    } else {
      // Handle server-side validation errors
      alert(data.detail || "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  } catch (error) {
    console.error("Login connection error:", error);
    alert("Connection error. Ensure your backend is running.");
    setIsLoading(false);
  }
};


  return (
    <div className="container-fluid p-0 d-flex flex-column flex-md-row" style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      
      {/* 🌲 LEFT PANE: BRANDING IMAGE OVERLAY COVERSHEAD (HIDDEN ON SMALL MOBILE VIEWS) */}
      <div 
        className="col-12 col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-white position-relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(11, 22, 34, 0.75)), url("https://images.unsplash.com/photo-1595841696660-16daffd543d0?q=80&w=1200&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh'
        }}
      >
        {/* Brand Header */}
        <div>
          <h4 className="fw-bold m-0" style={{ letterSpacing: '-0.02em' }}>MazaoSACCO</h4>
        </div>

        {/* Narrative Quote Box */}
        <div style={{ maxWidth: '460px', marginBottom: '40px' }}>
          <h1 className="fw-bold tracking-tight mb-4" style={{ fontSize: '3rem', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            Harvesting Your <br />
            <span style={{ color: '#4ADE80' }}>Financial Future.</span>
          </h1>
          <p className="fst-italic lh-base opacity-90 fw-medium" style={{ fontSize: '1.05rem', color: '#E2E8F0' }}>
            "Just as a single seed grows into a bountiful harvest, your consistent savings with us build a legacy of wealth for generations to come."
          </p>
          <div className="d-flex align-items-center gap-2 mt-4">
            <div style={{ width: '40px', height: '3px', backgroundColor: '#22C55E' }}></div>
            <span className="font-monospace text-uppercase fw-bold tracking-widest text-muted small" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Est. 1984
            </span>
          </div>
        </div>
      </div>

      {/* 🔐 RIGHT PANE: CORE AUTHENTICATION CREDENTIALS PANEL */}
      <div className="col-12 col-md-6 d-flex flex-column justify-content-between p-4 p-md-5 bg-white">
        
        {/* Empty placeholder container keeps alignment symmetrical */}
        <div className="d-none d-md-block"></div>

        {/* Central Credential Access Container Box */}
        <div className="mx-auto w-100" style={{ maxWidth: '420px', padding: '20px 0' }}>
          <div className="mb-4">
            <h2 className="fw-bold text-dark tracking-tight mb-2" style={{ color: '#092C4C', fontSize: '2.1rem' }}>Welcome Back</h2>
            <p className="text-muted small">Securely access your Mazao Member Portal.</p>
          </div>

          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            {/* Input Node Group 1: Member Identification String */}
            <div>
              <label className="form-label text-secondary fw-semibold mb-1.5" style={{ fontSize: '0.82rem' }}>
                Member ID or Email
              </label>
              <div className="position-relative">
                <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                <input 
                  type="text" 
                  required
                  className="form-control bg-white ps-5 py-2.5 rounded-3 border"
                  style={{ fontSize: '0.92rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="e.g. MS-98723"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Input Node Group 2: Security Hash Pin Pass string */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1.5">
                <label className="form-label text-secondary fw-semibold mb-0" style={{ fontSize: '0.82rem' }}>
                  Password
                </label>
                <a href="#forgot" className="text-decoration-none fw-bold small text-navy" style={{ fontSize: '0.78rem', color: '#0B4687' }}>
                  Forgot Password?
                </a>
              </div>
              <div className="position-relative">
                <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  className="form-control bg-white ps-5 pe-5 py-2.5 rounded-3 border"
                  style={{ fontSize: '0.92rem', color: '#334155', borderColor: '#CBD5E1' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Secure state element view eye toggle action */}
                <button
                  type="button"
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 p-1 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
                </button>
              </div>
            </div>

            {/* Submit Trigger Execution Element Node */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn text-white w-100 py-2.5 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 mt-2 border-0 shadow-sm"
              style={{ backgroundColor: '#092C4C', transition: 'all 0.2s' }}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
              ) : (
                <>
                  Login to Portal <i className="bi bi-box-arrow-in-right"></i>
                </>
              )}
            </button>
          </form>

          {/* Biometric Integration Authentication Row Separation Line split */}
          <div className="position-relative my-4 text-center">
            <hr className="text-muted opacity-20" />
            <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted font-monospace text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              Secure Login
            </span>
          </div>

          <div className="d-flex justify-content-center">
            <button 
              type="button" 
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-2 bg-white small fw-semibold shadow-sm border"
              style={{ fontSize: '0.85rem', color: '#334155' }}
            >
              <i className="bi bi-fingerprint text-primary fs-5"></i> Biometric
            </button>
          </div>

          {/* Retention Anchor Forward Route Matrix Link */}
          {/* Retention Anchor Forward Route Matrix Link */}
            <div className="text-center mt-4">
            <span className="text-muted small">Don't have an account? </span>
            <button 
                type="button" 
                className="btn btn-link p-0 fw-bold small text-success text-decoration-none shadow-none" 
                style={{ color: '#16A34A', verticalAlign: 'baseline' }}
                onClick={() => navigate('/signup')} // 👈 Programmatic link to SignUp screen
            >
                Sign Up
            </button>
            </div>
        </div>

        {/* 📋 LOWER FOOTER REGULATORY AND COMPLIANCE INFO CHIP LAYER */}
        <div className="border-top pt-3 mt-4 d-flex justify-content-between align-items-center text-muted font-monospace" style={{ fontSize: '0.68rem', letterSpacing: '0.02em' }}>
          <div className="d-flex align-items-center gap-1.5">
            <i className="bi bi-shield-lock-fill text-success"></i>
            <span>256-BIT SSL ENCRYPTED</span>
          </div>
          <div className="d-flex gap-3">
            <a href="#help" className="text-decoration-none text-muted hover-text-dark">HELP CENTER</a>
            <a href="#privacy" className="text-decoration-none text-muted hover-text-dark">PRIVACY</a>
          </div>
        </div>

      </div>
    </div>
  );
  }
