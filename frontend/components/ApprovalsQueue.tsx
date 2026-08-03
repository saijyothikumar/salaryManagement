'use client';

import React, { useState } from 'react';
import { ApprovalRequest, handleApprovalAction } from '../lib/api';

type ApprovalsQueueProps = {
  approvals: ApprovalRequest[];
  isHRManager?: boolean;
  token: string | null;
  onRefresh: () => void;
};

export default function ApprovalsQueue({
  approvals,
  isHRManager = false,
  token,
  onRefresh,
}: ApprovalsQueueProps) {
  const [rejectingItem, setRejectingItem] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApproveDirect = async (item: ApprovalRequest) => {
    if (!isHRManager) return;
    try {
      setLoadingId(item.id);
      setError(null);
      await handleApprovalAction(item.id, 'approve', undefined, token || '');
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Approval failed.');
    } finally {
      setLoadingId(null);
    }
  };

  const submitRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem || !isHRManager) return;

    if (!rejectionReason.trim()) {
      setError('A rejection reason comment is mandatory when rejecting a request.');
      return;
    }

    try {
      setLoadingId(rejectingItem.id);
      setError(null);
      await handleApprovalAction(rejectingItem.id, 'reject', rejectionReason.trim(), token || '');
      setRejectingItem(null);
      setRejectionReason('');
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Rejection failed.');
    } finally {
      setLoadingId(null);
    }
  };

  const authTooltip = isHRManager
    ? 'Click to perform HR action'
    : 'Please log in as HR Manager to approve or reject requests';

  return (
    <div className="feature-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F4C5C' }}>
            Pending HR Approvals & Claims Queue
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#5C5C5C', marginTop: '0.15rem' }}>
            Onboarding offers, salary adjustments, advances, and reimbursement claims.
          </p>
        </div>
        <span className="hero-pill" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
          {approvals.length} pending approval{approvals.length === 1 ? '' : 's'}
        </span>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: '#fdf0ed', border: '1px solid #f8c9be', color: '#b84328', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {approvals.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#5C5C5C', fontSize: '0.9rem', background: '#F7F6F3', borderRadius: '8px' }}>
          ✓ All approval requests have been processed! New items will auto-replenish on refresh.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch', borderRadius: '8px', border: '1px solid #E5E2DC' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse', background: '#ffffff' }}>
            <thead>
              <tr style={{ background: '#F7F6F3', borderBottom: '2px solid #E5E2DC' }}>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', whiteSpace: 'nowrap', width: '14%' }}>Request Type</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', whiteSpace: 'nowrap', width: '14%' }}>Employee Code</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', whiteSpace: 'nowrap', width: '18%' }}>Employee Name</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', whiteSpace: 'nowrap', width: '14%' }}>Department</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', whiteSpace: 'nowrap', width: '14%' }}>Amount</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', whiteSpace: 'nowrap', width: '16%' }}>Attachment</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap', width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((item) => {
                const typeLabel = item.request_type.replace('_', ' ').toUpperCase();
                const isProcessing = loadingId === item.id;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <span className="status-badge" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                        {typeLabel}
                      </span>
                    </td>
                    <td className="font-mono" style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                      {item.employee_code}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <span
                        title={item.employee_name}
                        style={{
                          fontWeight: 600,
                          color: '#1A1A1A',
                          cursor: 'pointer',
                        }}
                      >
                        {item.employee_name}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <span
                        title={item.department}
                        style={{
                          color: '#5C5C5C',
                          cursor: 'pointer',
                        }}
                      >
                        {item.department}
                      </span>
                    </td>
                    <td className="font-mono font-semibold" style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap', color: '#0F4C5C' }}>
                      ${item.requested_amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                      {item.attachment_filename ? (
                        <span
                          title={`Attached Document: ${item.attachment_filename}`}
                          style={{
                            fontSize: '0.8rem',
                            color: '#1D8A7A',
                            background: '#e6f4f1',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          📎 {item.attachment_filename}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div
                        style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}
                        title={authTooltip}
                      >
                        <button
                          type="button"
                          onClick={() => handleApproveDirect(item)}
                          disabled={!isHRManager || isProcessing}
                          title={authTooltip}
                          style={{
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: isHRManager ? '#1D8A7A' : '#94a3b8',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isHRManager ? 'pointer' : 'not-allowed',
                            opacity: isHRManager ? 1 : 0.65,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingItem(item);
                            setRejectionReason('');
                          }}
                          disabled={!isHRManager || isProcessing}
                          title={authTooltip}
                          style={{
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: isHRManager ? '#E76F51' : '#94a3b8',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isHRManager ? 'pointer' : 'not-allowed',
                            opacity: isHRManager ? 1 : 0.65,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mandatory Rejection Comment Modal */}
      {rejectingItem && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: '#E76F51' }}>
                Reject Request: {rejectingItem.employee_name}
              </h2>
              <button type="button" onClick={() => setRejectingItem(null)} className="modal-close">
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#5C5C5C', marginBottom: '1rem' }}>
              A <strong>mandatory rejection comment</strong> is required to explain why this request for ${rejectingItem.requested_amount.toLocaleString()} is being denied.
            </p>

            <form onSubmit={submitRejection}>
              <div className="form-group">
                <label className="form-label" htmlFor="reject-comment">
                  Rejection Reason Comment (Required)
                </label>
                <textarea
                  id="reject-comment"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Requested advance exceeds 50% monthly limit / Budget constraint"
                  className="form-input"
                  style={{ width: '100%', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="auth-btn auth-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReason.trim()}
                  className="auth-btn"
                  style={{ background: '#E76F51', color: '#ffffff' }}
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
