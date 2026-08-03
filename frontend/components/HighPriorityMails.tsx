'use client';

import React, { useState } from 'react';

type MailItem = {
  id: number;
  sender: string;
  role: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  priority: 'high' | 'urgent' | 'normal';
  attachment?: string;
};

type HighPriorityMailsProps = {
  isHRManager?: boolean;
};

const SAMPLE_MAILS: MailItem[] = [
  {
    id: 1,
    sender: 'Sarah Jenkins',
    role: 'Payroll Operations Lead',
    subject: 'URGENT: Japan Regional Salary Deposit Clearing Lag',
    preview: 'Banking network clearing delay for Tokyo office June payroll release requires immediate signoff...',
    body: 'Hello HR Manager,\n\nWe have encountered a 24-hour clearing lag from Tokyo Mitsubishi Bank regarding the June payroll batch for our 800 Japan-based employees. The payroll total is ¥1.28B JPY. All tax deductions have been verified.\n\nPlease approve the contingency authorization request in your queue so we can release funds via our secondary clearing partner.\n\nRegards,\nSarah Jenkins\nPayroll Lead',
    time: '09:15 AM',
    priority: 'urgent',
    attachment: 'Tokyo_Bank_Clearing_Report.pdf',
  },
  {
    id: 2,
    sender: 'David Ross',
    role: 'UK HR Compliance Officer',
    subject: 'UK Tax Reference Verification Audit - 3 Pending New Hires',
    preview: 'HMRC audit check complete for Q3 hires. 3 staff require verified National Insurance codes...',
    body: 'Hi HR Team,\n\nFollowing HMRC compliance checks, 3 new hires in London (EMP-10492, EMP-08412, EMP-02941) require updated National Insurance verification documentation before July payroll cutoff.\n\nI have created tracking tickets for the team to complete this before Friday.\n\nBest,\nDavid Ross',
    time: '10:30 AM',
    priority: 'high',
    attachment: 'HMRC_Compliance_Summary.pdf',
  },
  {
    id: 3,
    sender: 'Elena Rostova',
    role: 'Global Benefits Administrator',
    subject: 'Executive Relocation Allowance Claims - Q3 Batch',
    preview: 'Submitted 4 relocation reimbursement claims for engineering staff transferring to Germany office...',
    body: 'Dear HR Manager,\n\nPlease find attached the travel and relocation expense receipts for our 4 Senior Engineers relocating to the Berlin office. Total claim is €14,200.\n\nAll receipts match ACME corporate travel policy.\n\nThanks,\nElena Rostova',
    time: '11:45 AM',
    priority: 'normal',
    attachment: 'Berlin_Relocation_Receipts.pdf',
  },
];

export default function HighPriorityMails({ isHRManager = false }: HighPriorityMailsProps) {
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [actionDone, setActionDone] = useState(false);

  const authTooltip = isHRManager
    ? 'Click to open executive mail'
    : 'Please log in as HR Manager to view executive emails';

  const handleOpenMail = (mail: MailItem) => {
    if (!isHRManager) return;
    setSelectedMail(mail);
    setActionDone(false);
  };

  return (
    <div className="feature-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F4C5C', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📬</span> High-Priority HR Communications & Mails
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#5C5C5C', marginTop: '0.15rem' }}>
            Executive inbox items requiring HR Manager review or decision.
          </p>
        </div>
        <span className="hero-pill" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
          3 Priority Messages
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {SAMPLE_MAILS.map((mail) => (
          <div
            key={mail.id}
            onClick={() => handleOpenMail(mail)}
            title={authTooltip}
            style={{
              background: '#ffffff',
              border: '1px solid #E5E2DC',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              cursor: isHRManager ? 'pointer' : 'not-allowed',
              opacity: isHRManager ? 1 : 0.75,
              transition: 'all 0.2s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    color: '#ffffff',
                    background: mail.priority === 'urgent' ? '#E76F51' : mail.priority === 'high' ? '#E9C46A' : '#0F4C5C',
                  }}
                >
                  {mail.priority}
                </span>
                <strong style={{ fontSize: '0.875rem', color: '#1A1A1A' }}>{mail.sender}</strong>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>({mail.role})</span>
              </div>

              <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: '#0F4C5C', margin: '0.2rem 0' }}>
                {mail.subject}
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#5C5C5C', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                {mail.preview}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {mail.attachment && (
                <span style={{ fontSize: '0.8rem', color: '#1D8A7A', background: '#e6f4f1', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  📎 Attachment
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{mail.time}</span>
              <button
                type="button"
                disabled={!isHRManager}
                title={authTooltip}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  background: isHRManager ? '#0F4C5C' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isHRManager ? 'pointer' : 'not-allowed',
                  opacity: isHRManager ? 1 : 0.65,
                  whiteSpace: 'nowrap',
                }}
              >
                {isHRManager ? 'Read Mail →' : 'HR Auth Required'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mail Reader Modal */}
      {selectedMail && isHRManager && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMail(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 76, 92, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '600px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    color: '#ffffff',
                    background: selectedMail.priority === 'urgent' ? '#E76F51' : '#0F4C5C',
                  }}
                >
                  {selectedMail.priority} Mail
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F4C5C', marginTop: '0.4rem' }}>
                  {selectedMail.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMail(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#F7F6F3', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#5C5C5C' }}>
              <div><strong>From:</strong> {selectedMail.sender} ({selectedMail.role})</div>
              <div><strong>Received:</strong> Today at {selectedMail.time}</div>
              {selectedMail.attachment && (
                <div style={{ marginTop: '0.25rem', color: '#1D8A7A' }}>
                  <strong>Attached File:</strong> 📎 {selectedMail.attachment}
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.9rem', color: '#1A1A1A', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
              {selectedMail.body}
            </div>

            {actionDone && (
              <div style={{ padding: '0.75rem', background: '#e6f4f1', color: '#1D8A7A', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ✓ HR Action acknowledged! Request logged in audit history.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedMail(null)}
                className="auth-btn auth-btn-outline"
              >
                Close Mail
              </button>
              <button
                type="button"
                onClick={() => setActionDone(true)}
                className="auth-btn auth-btn-primary"
              >
                Take HR Action / Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
