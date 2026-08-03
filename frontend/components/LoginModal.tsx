'use client';

import React, { useState } from 'react';
import { AuthUser, loginHR } from '../lib/api';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser, token: string) => void;
};

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('hr_admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await loginHR(username, password);
      onSuccess(res.user, res.access_token);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">HR Manager Login</h2>
          <button type="button" onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fdf0ed', border: '1px solid #f8c9be', color: '#b84328', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="e.g. hr_admin"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password..."
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="auth-btn auth-btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading ? 'Authenticating...' : 'Sign In as HR Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
