// components/loan/LoanReviewView.jsx
import React from 'react';

const LoanReview = ({ loan }) => {
    // 1. Always add this safety check
  if (!loan) {
    return <div className="p-4 text-center">Loading application details...</div>;
  }
  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link text-dark p-0 me-3"><i className="bi bi-arrow-left fs-4"></i></button>
        <h4 className="fw-bold mb-0">Application #{loan.id}</h4>
      </div>

      <div className="row g-4">
        {/* Left Column: Applicant & Workflow */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-3 mb-4">
            <div className="d-flex align-items-center">
              <img 
                src={"https://www.w3schools.com/howto/img_avatar.png"} 
                        alt="Profile" 
                        className="rounded-circle me-3" 
                        width="50" 
                        height="50" 
                        />
              <div>
                <h5 className="fw-bold mb-0">{loan.name}</h5>
                <small className="text-muted">MEMBER ID: {loan.memberId}</small>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <div><small className="text-muted d-block">CREDIT SCORE</small><strong className="text-success">{loan.score}</strong></div>
              <div><small className="text-muted d-block">TENURE</small><strong>{loan.tenure} Years</strong></div>
            </div>
          </div>
          
          {/* Approval Workflow */}
          <div className="card border-0 shadow-sm p-3">
            <h6 className="fw-bold mb-3">Approval Workflow</h6>
            {/* Workflow Steps rendered here */}
          </div>
        </div>

        {/* Right Column: Loan Details & Schedule */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between mb-4">
              <div>
                <small className="text-muted">REQUESTED AMOUNT</small>
                <h3 className="fw-bold">UGX {loan.amount}</h3>
              </div>
              <span className="badge bg-primary text-uppercase">Business Growth Loan</span>
            </div>
            {/* Additional details: Tenure, Frequency, Purpose */}
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3">Projected Repayment Schedule</h6>
            <table className="table table-sm">
               {/* Map your schedule data here */}
            </table>
          </div>
        </div>
      </div>

      {/* Floating Footer Action Bar */}
      {/* <div className="fixed-bottom bg-white border-top p-3 shadow-lg d-flex align-items-center px-4">
        <input type="text" className="form-control me-3" placeholder="Add specific notes for the credit committee..." />
        <button className="btn btn-outline-danger me-2 px-4">Reject</button>
        <button className="btn btn-outline-secondary me-2 px-4">Clarify</button>
        <button className="btn btn-primary px-5">Approve</button>
      </div> */}
    </div>
  );
};

export default LoanReview;