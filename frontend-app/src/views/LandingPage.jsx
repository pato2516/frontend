import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="landing-page-wrapper" style={{ backgroundColor: '#F8FAFC', color: '#0F2942', overflowX: 'hidden' }}>
      
      {/* 1. PUBLIC TOP HEADER NAVIGATION BAR (STICKY FIXED) */}
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top px-4 py-3 border-bottom shadow-sm">
        <div className="container-fluid max-width-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <a className="navbar-brand fw-bold text-primary fs-4 m-0" href="#" style={{ letterSpacing: '-0.03em', color: '#0B4687' }}>
            MazaoSACCO
            </a>
            
            <div className="d-none d-lg-flex align-items-center gap-4 mx-auto">
            <a href="#" className="text-decoration-none fw-bold text-dark small border-bottom border-2 border-primary pb-1">Home</a>
            <a href="#services" className="text-decoration-none fw-semibold text-muted small hover-text-dark">Services</a>
            <a href="#about" className="text-decoration-none fw-semibold text-muted small hover-text-dark">About Us</a>
            <a href="#contact" className="text-decoration-none fw-semibold text-muted small hover-text-dark">Contact</a>
            </div>

            <div className="d-flex align-items-center gap-3">
            <button className="btn p-1 position-relative border-0" type="button">
                <i className="bi bi-bell text-secondary fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"></span>
            </button>
            <div className="rounded-circle bg-secondary overflow-hidden" style={{ width: '35px', height: '35px' }}>
                <div className="w-100 h-100 bg-primary d-flex align-items-center justify-content-center text-white fw-bold small">AK</div>
            </div>
            </div>
        </div>
    </nav>

      {/* 2. HERO SPLASH BANNER WITH TECH/FINANCE BACKDROP */}
      <section 
        className="position-relative text-white d-flex align-items-center"
        style={{
          minHeight: '85vh',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.6)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container px-4 py-5" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="row">
            <div className="col-12 col-lg-7">
              <span className="badge px-3 py-2 rounded-pill text-uppercase font-monospace fw-bold mb-3" style={{ backgroundColor: '#2563EB', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                Secure Wealth Creation
              </span>
              <h1 className="fw-bold tracking-tight lh-sm mb-3" style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>
                Empowering Members, <br />
                <span style={{ color: '#38BDF8' }}>Securing Futures</span>
              </h1>
              <p className="opacity-90 fs-5 mb-4 font-sans max-w-lg" style={{ maxWidth: '540px', fontWeight: '400', lineHeight: '1.6' }}>
                Join Uganda's premier financial cooperative. Experience customized savings plans and competitive credit lines built to elevate your personal and business milestones.
              </p>
              
             {/* Update your layout navigation middle links if you like, or jump straight to the user profile section on the right: */}
                <div className="d-flex align-items-center gap-3">
                {/* Replacing the old profile circle icon with explicit action gateways */}
                    <button 
                        className="btn btn-sm btn-outline-primary fw-semibold px-3 py-1.5"
                        style={{ borderColor: '#0B4687', color: '#0B4687' }}
                        onClick={() => navigate('/login')}
                    >
                        Member Login
                    </button>
                    <button 
                        className="btn btn-sm text-white fw-bold px-3 py-1.5 border-0"
                        style={{ backgroundColor: '#0B4687' }}
                        onClick={() => navigate('/signup')}
                    >
                        Register
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Floating Metrics Badge Row */}
        <div 
          className="position-absolute bottom-0 end-0 m-4 p-4 bg-white text-dark rounded-3 shadow-lg d-flex gap-4 align-items-center"
          style={{ maxWidth: '380px', borderLeft: '5px solid #2563EB', zIndex: 10 }}
        >
          <div>
            <span className="text-muted text-uppercase d-block extra-small fw-bold tracking-wider" style={{ fontSize: '0.65rem' }}>Active Members</span>
            <h4 className="fw-bold text-navy mb-0" style={{ color: '#0F2942' }}>45,000+</h4>
          </div>
          <div className="border-start ps-4">
            <span className="text-muted text-uppercase d-block extra-small fw-bold tracking-wider" style={{ fontSize: '0.65rem' }}>Annual Dividends</span>
            <h4 className="fw-bold text-primary mb-0">8.5%</h4>
          </div>
        </div>
      </section>

      {/* 3. FINANCIAL SOLUTIONS SEGMENT CARDS */}
      <section id="services" className="py-5 bg-white">
        <div className="container px-4 py-4 text-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="fw-bold text-navy mb-2" style={{ color: '#0F2942', letterSpacing: '-0.02em' }}>Financial Solutions for Every Milestone</h2>
          <p className="text-muted max-w-xl mx-auto mb-5" style={{ maxWidth: '600px', fontSize: '0.95rem' }}>
            From daily savings targets to major capital financing, we provide the security and leverage you need to thrive.
          </p>

          <div className="row g-4 text-start">
            {/* Savings Accounts Card */}
            <div className="col-12 col-lg-8">
              <div className="border h-100 p-4 rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4" style={{ backgroundColor: '#F8FAFC' }}>
                <div style={{ maxWidth: '400px' }}>
                  <div className="text-primary mb-3 fs-3"><i className="bi bi-wallet2"></i></div>
                  <h4 className="fw-bold mb-2">High-Yield Savings</h4>
                  <p className="text-muted small lh-base">
                    Enjoy guaranteed, competitive compound annual interest on your deposits with customized fixed terms and zero hidden ledger maintenance fees.
                  </p>
                  <a href="#" className="text-decoration-none text-primary fw-bold small d-inline-flex align-items-center gap-1 mt-2">
                    Start Saving <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
                {/* Custom Gradient Financial Vector Box */}
                <div className="rounded-3 bg-dark overflow-hidden flex-shrink-0 shadow-sm" style={{ width: '240px', height: '150px', backgroundImage: 'linear-gradient(135deg, #0F2942 0%, #2563EB 100%)' }}>
                  <div className="p-3 text-white h-100 d-flex flex-column justify-content-between opacity-40">
                    <span className="small font-monospace">ASSET GROWTH</span>
                    <i className="bi bi-graph-up-arrow fs-1 align-self-end"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Flexible Credit Block Card */}
            <div className="col-12 col-lg-4">
              <div className="text-white p-4 h-100 rounded-3 d-flex flex-column justify-content-between" style={{ backgroundColor: '#002D5A' }}>
                <div>
                  <div className="text-info mb-3 fs-3"><i className="bi bi-cash-coin"></i></div>
                  <h4 className="fw-bold mb-2">Flexible Credit</h4>
                  <p className="opacity-75 small lh-sm mb-4">
                    Access instant emergency credit, asset financing, or development loans with optimized evaluation terms and structured processing workflows.
                  </p>
                  <ul className="list-unstyled d-flex flex-column gap-2 small opacity-90 mb-4">
                    <li><i className="bi bi-check-circle-fill text-info me-2"></i> Transparent asset backing</li>
                    <li><i className="bi bi-check-circle-fill text-info me-2"></i> Swift 24hr processing gates</li>
                    <li><i className="bi bi-check-circle-fill text-info me-2"></i> Tailored amortization terms</li>
                  </ul>
                </div>
                <button className="btn btn-info w-100 py-2.5 fw-bold border-0 text-white" style={{ backgroundColor: '#2563EB' }} type="button">Apply for Credit</button>
              </div>
            </div>

            {/* Share Capital Sub Card */}
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-3 border h-100" style={{ backgroundColor: '#EFF6FF' }}>
                <div className="text-primary mb-3 fs-3"><i className="bi bi-pie-chart"></i></div>
                <h5 className="fw-bold mb-2">Share Capital & Equity</h5>
                <p className="text-muted small mb-0 lh-sm">
                  Become a direct voting co-owner of the cooperative and reap stable annual dividend returns derived from our high-performance investment portfolios.
                </p>
              </div>
            </div>

            {/* Institutional Security Cover */}
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-3 border h-100" style={{ backgroundColor: '#F0FDF4' }}>
                <div className="text-success mb-3 fs-3"><i className="bi bi-shield-check"></i></div>
                <h5 className="fw-bold mb-2">Benevolent & Security Cover</h5>
                <p className="text-muted small mb-0 lh-sm">
                  Safeguard your family's baseline security with collective risk mitigation reserves and comprehensive financial welfare backings.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BRAND VALUE PROP SECTION MATRIX GRID */}
      <section id="about" className="py-5 text-white" style={{ backgroundColor: '#001E36' }}>
        <div className="container px-4 py-5" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <h2 className="fw-bold tracking-tight mb-4" style={{ fontSize: '2.2rem' }}>Engineered for Financial Inclusion</h2>
              
              <div className="d-flex flex-column gap-4">
                <div className="d-flex gap-3">
                  <div className="fs-3 text-info"><i className="bi bi-building"></i></div>
                  <div>
                    <h5 className="fw-bold mb-1">Democratic Governance</h5>
                    <p className="opacity-75 small lh-sm">Operated fully under regulatory global cooperative models. Every member holds an equal voice, guaranteeing transparent management paradigms.</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="fs-3 text-info"><i className="bi bi-phone-vibrate"></i></div>
                  <div>
                    <h5 className="fw-bold mb-1">Omnichannel Digital Portals</h5>
                    <p className="opacity-75 small lh-sm">Access capital anywhere, anytime. Secure instant checkbooks, processing dashboards, USSD systems, and mobile banking applications.</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="fs-3 text-info"><i className="bi bi-graph-up"></i></div>
                  <div>
                    <h5 className="fw-bold mb-1">Compound Asset Alignment</h5>
                    <p className="opacity-75 small lh-sm">Your financial roadmap drives our design. Get flexible options mapped directly to regular income flow points and payroll schedules.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Picture Box Container Graphic Layout Node */}
            <div className="col-12 col-lg-6 position-relative">
              <div className="rounded-3 overflow-hidden shadow-lg border border-secondary border-opacity-20" style={{ height: '380px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" 
                  alt="Modern business workspace collaboration" 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-white text-dark rounded-2 shadow small d-flex align-items-center gap-2">
                <i className="bi bi-award-fill text-warning fs-5"></i>
                <div>
                  <span className="fw-bold d-block" style={{ fontSize: '0.8rem' }}>Top Tier Cooperative</span>
                  <span className="text-muted extra-small d-block" style={{ fontSize: '0.7rem' }}>FinTech Excellence 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION RETENTION BANNER */}
      <section className="py-5 bg-light">
        <div className="container px-4 py-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="bg-white border text-center p-5 rounded-3 shadow-sm position-relative overflow-hidden">
            <h3 className="fw-bold mb-2">Ready to maximize your financial capacity?</h3>
            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '500px' }}>
              It takes less than 5 minutes to set up your membership portfolio and launch your journey toward compounding wealth.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <button className="btn btn-primary text-white px-4 py-2.5 fw-bold border-0" style={{ backgroundColor: '#0B4687' }} type="button">Register Online</button>
              <button className="btn btn-outline-secondary px-4 py-2.5 fw-semibold" type="button">Consult an Advisor</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PUBLIC FOOTER REGISTER */}
      <footer id="contact" className="text-white pt-5 pb-3" style={{ backgroundColor: '#0B1520' }}>
        <div className="container px-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <h5 className="fw-bold text-primary mb-3" style={{ color: '#38BDF8' }}>MazaoSACCO</h5>
              <p className="opacity-60 small lh-base mb-3" style={{ maxWidth: '280px' }}>
                Pioneering institutional financial security through collective investment pipelines, transparent savings frameworks, and digital banking innovations.
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} type="button"><i className="bi bi-facebook"></i></button>
                <button className="btn btn-sm btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} type="button"><i className="bi bi-twitter-x"></i></button>
                <button className="btn btn-sm btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} type="button"><i className="bi bi-linkedin"></i></button>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <span className="text-uppercase tracking-wider extra-small text-muted fw-bold d-block mb-3" style={{ fontSize: '0.7rem' }}>Quick Links</span>
              <ul className="list-unstyled d-flex flex-column gap-2 small opacity-75">
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Our Products</a></li>
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Yield Calculator</a></li>
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Dividend Scheme</a></li>
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Help & Support</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-2">
              <span className="text-uppercase tracking-wider extra-small text-muted fw-bold d-block mb-3" style={{ fontSize: '0.7rem' }}>Legal</span>
              <ul className="list-unstyled d-flex flex-column gap-2 small opacity-75">
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Terms of Service</a></li>
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Bylaws</a></li>
                <li><a href="#" className="text-white text-decoration-none hover-text-primary">Data Protection</a></li>
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <span className="text-uppercase tracking-wider extra-small text-muted fw-bold d-block mb-3" style={{ fontSize: '0.7rem' }}>Contact Info</span>
              <ul className="list-unstyled d-flex flex-column gap-2.5 small opacity-75">
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-geo-alt text-primary mt-0.5" style={{ color: '#38BDF8' }}></i>
                  <span>Financial Plaza, 4th Floor, Kampala, Uganda</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-telephone text-primary" style={{ color: '#38BDF8' }}></i>
                  <span>+256 700 000 000</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope text-primary" style={{ color: '#38BDF8' }}></i>
                  <span>info@mazaosacco.co.ug</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-top pt-3 d-flex flex-column flex-md-row justify-content-between text-muted extra-small" style={{ borderColor: 'rgba(255,255,255,0.08)', fontSize: '0.75rem' }}>
            <span>© 2026 MazaoSACCO. All rights reserved.</span>
            <div className="d-flex gap-3 mt-2 mt-md-0">
              <span>Tier 1 Regulated Cooperative</span>
              <span>•</span>
              <span>Bank-level Security Sync</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}