'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../lib/AuthContext';
import {
  validateBatchImportRows,
  commitBatchImport,
  ImportErrorItem,
  ImportValidatedItem,
  BatchValidateResponse,
} from '../../lib/api';

export default function ImportPage() {
  const { token, user, openLogin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<BatchValidateResponse | null>(null);

  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security Check: Extension validation
  const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

  const validateFileExtension = (name: string): boolean => {
    const lower = name.toLowerCase();
    return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFileError(null);
    setCommitMessage(null);
    setValidationResult(null);

    if (!validateFileExtension(selectedFile.name)) {
      setFileError(
        `Security Alert: Invalid file extension "${selectedFile.name}". Only spreadsheet files (.xlsx, .xls, .csv) are allowed.`
      );
      setFile(null);
      setFileName('');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setIsValidating(true);

    try {
      // Read file binary array buffer
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });

      // Use first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet rows to JSON
      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rawRows || rawRows.length === 0) {
        throw new Error('The uploaded spreadsheet file contains no rows or data.');
      }

      // Security check: Scan for script tags in text values
      for (const row of rawRows) {
        for (const val of Object.values(row)) {
          if (typeof val === 'string' && (val.includes('<script') || val.includes('javascript:'))) {
            throw new Error('Security Error: Malicious script tags or executable signatures detected in spreadsheet.');
          }
        }
      }

      // Call backend validation API endpoint
      const result = await validateBatchImportRows(rawRows);
      setValidationResult(result);
    } catch (err: any) {
      console.error('[Excel Parse/Validation Error]:', err);
      setFileError(err.message || 'Failed to process spreadsheet file. Please check file format.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCommit = async () => {
    if (!validationResult || validationResult.validated.length === 0) return;

    if (!user || !token) {
      setCommitMessage({
        type: 'error',
        text: '🔒 HR Manager Authorization Required: You are currently in Guest Mode. Please log in to commit batch imports to the database.',
      });
      openLogin();
      return;
    }

    setIsCommitting(true);
    setCommitMessage(null);

    try {
      const res = await commitBatchImport(validationResult.validated, token);
      setCommitMessage({
        type: 'success',
        text: res.message || `Successfully committed ${res.records_updated} records to database!`,
      });
    } catch (err: any) {
      console.error('[Batch Commit Error]:', err);
      setCommitMessage({
        type: 'error',
        text: err.message || 'Failed to commit batch records to database.',
      });
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Header & Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <BackButton />
        <span style={{ fontSize: '0.85rem', color: '#1D8A7A', fontWeight: 600 }}>
          📊 Excel Batch Compensation Update
        </span>
      </div>

      {/* Page Title & Intro */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#0F4C5C', marginBottom: '0.5rem', fontWeight: 700 }}>
          Excel Sheet Data Migration & Compensation Importer
        </h1>
        <p style={{ color: '#555555', fontSize: '0.95rem', maxWidth: '850px', lineHeight: 1.6 }}>
          Transition seamlessly away from legacy Excel spreadsheets. Upload your payroll files below—our platform will
          crunch and validate every row against 10,000 workforce database records, isolating discrepancies and isolating valid rows for single-click database insertion.
        </p>
      </div>

      {/* File Dropzone & Uploader */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #1D8A7A',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          backgroundColor: '#F9FBFB',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          marginBottom: '2rem',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />

        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📁</div>
        <h3 style={{ fontSize: '1.15rem', color: '#0F4C5C', marginBottom: '0.25rem', fontWeight: 600 }}>
          {fileName ? `Selected File: ${fileName}` : 'Drag & Drop your Excel (.xlsx, .xls, .csv) file here'}
        </h3>
        <p style={{ color: '#777777', fontSize: '0.85rem' }}>
          or click to browse files from your computer. Accepts <code>.xlsx</code>, <code>.xls</code>, or <code>.csv</code> formats.
        </p>

        {fileName && !isValidating && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (fileInputRef.current) fileInputRef.current.value = '';
              setFile(null);
              setFileName('');
              setValidationResult(null);
              setFileError(null);
            }}
            style={{
              marginTop: '1rem',
              background: '#E76F51',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Clear Selected File ✕
          </button>
        )}
      </div>

      {/* Security Alert Banner */}
      {fileError && (
        <div
          style={{
            backgroundColor: '#FDF2F2',
            border: '1px solid #E76F51',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            color: '#D9534F',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span>🛑</span>
          <div>
            <strong>Validation Error:</strong> {fileError}
          </div>
        </div>
      )}

      {/* Validation Loader Spinner */}
      {isValidating && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E0E0E0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '5px solid #E0E0E0',
              borderTop: '5px solid #1D8A7A',
              borderRadius: '50%',
              margin: '0 auto 1.25rem auto',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h3 style={{ fontSize: '1.1rem', color: '#0F4C5C', marginBottom: '0.5rem' }}>
            Crunching Excel Data & Validating Records...
          </h3>
          <p style={{ color: '#666666', fontSize: '0.875rem' }}>
            Cross-checking codes, countries, bonus bounds, and security formatting against 10,000 workforce rows.
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Commit Feedback Banner */}
      {commitMessage && (
        <div
          style={{
            backgroundColor: commitMessage.type === 'success' ? '#F4FBF9' : '#FDF2F2',
            border: `1px solid ${commitMessage.type === 'success' ? '#2A9D8F' : '#E76F51'}`,
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            color: commitMessage.type === 'success' ? '#2A9D8F' : '#D9534F',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span>{commitMessage.type === 'success' ? '🎉' : '⚠️'}</span>
          <div>
            <strong>{commitMessage.type === 'success' ? 'Batch Commit Successful:' : 'Batch Commit Notice:'}</strong>{' '}
            {commitMessage.text}
          </div>
        </div>
      )}

      {/* Validation Results Overview Cards */}
      {validationResult && !isValidating && (
        <div style={{ marginBottom: '2.5rem' }}>
          {/* Summary Stat Pill Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#F8F9FA', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #0F4C5C' }}>
              <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>Total Rows Scanned</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F4C5C' }}>{validationResult.total_rows}</div>
            </div>
            <div style={{ background: '#F4FBF9', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #2A9D8F' }}>
              <div style={{ fontSize: '0.75rem', color: '#2A9D8F', textTransform: 'uppercase', fontWeight: 600 }}>Validated (Ready)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2A9D8F' }}>{validationResult.valid_count}</div>
            </div>
            <div style={{ background: '#FDF2F2', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #E76F51' }}>
              <div style={{ fontSize: '0.75rem', color: '#D9534F', textTransform: 'uppercase', fontWeight: 600 }}>Validation Failures</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#D9534F' }}>{validationResult.error_count}</div>
            </div>
          </div>

          {/* TABLE 1: VALIDATION FAILURES & ERRORS */}
          <div
            style={{
              border: '2px solid #E76F51',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              marginBottom: '2.5rem',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(231,111,81,0.08)',
            }}
          >
            {/* Header Callout & Table Description */}
            <div style={{ backgroundColor: '#FDF2F2', padding: '1rem 1.25rem', borderBottom: '1px solid #F5C6CB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🛑</span>
                <h2 style={{ fontSize: '1.1rem', color: '#D9534F', fontWeight: 700, margin: 0 }}>
                  Table 1: Validation Failures & Error Log ({validationResult.error_count} Rows)
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#A94442', lineHeight: 1.4 }}>
                The records listed below failed system rules due to missing/invalid employee codes, country mismatches, or malformed bonus numbers. These rows are excluded from database insertion.
              </p>
            </div>

            {/* Scrollable Container with Horizontal and Vertical Scroll */}
            <div style={{ maxHeight: '360px', overflowX: 'auto', overflowY: 'auto' }}>
              {validationResult.errors.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#2A9D8F', fontSize: '0.9rem' }}>
                  ✨ Fantastic! Zero validation errors detected in uploaded spreadsheet.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#FFF0F0', position: 'sticky', top: 0, zIndex: 2 }}>
                    <tr>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #F5C6CB', color: '#8A3B38' }}>Row #</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #F5C6CB', color: '#8A3B38' }}>Emp Code</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #F5C6CB', color: '#8A3B38' }}>Name</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #F5C6CB', color: '#8A3B38' }}>Uploaded Bonus</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #F5C6CB', color: '#8A3B38' }}>Uploaded Country</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #F5C6CB', color: '#D9534F', minWidth: '280px' }}>Failure Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.errors.map((err, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #FADBD8', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FDF7F7' }}>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: '#666' }}>#{err.row_index}</td>
                        <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>{err.employee_code}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>{err.name}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>{err.uploaded_bonus}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>{err.uploaded_country}</td>
                        <td style={{ padding: '0.65rem 1rem', color: '#D9534F', fontWeight: 600 }}>{err.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* TABLE 2: VALIDATED RECORDS READY FOR IMPORT */}
          <div
            style={{
              border: '2px solid #2A9D8F',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(42,157,143,0.08)',
            }}
          >
            {/* Header Callout & Table Description with Commit Button */}
            <div style={{ backgroundColor: '#F4FBF9', padding: '1rem 1.25rem', borderBottom: '1px solid #B2DFDB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <h2 style={{ fontSize: '1.1rem', color: '#1D8A7A', fontWeight: 700, margin: 0 }}>
                    Table 2: Validated Records Ready for Database Commit ({validationResult.valid_count} Rows)
                  </h2>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#2A9D8F', lineHeight: 1.4 }}>
                  Records verified against 10,000 active employees. Click 'Commit Batch Import' to persist compensation updates to SQLite database.
                </p>
              </div>

              {/* Top Right Action Button */}
              <div>
                <button
                  type="button"
                  onClick={handleCommit}
                  disabled={isCommitting || validationResult.valid_count === 0}
                  style={{
                    backgroundColor: isCommitting ? '#888888' : !user ? '#0F4C5C' : '#2A9D8F',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: isCommitting || validationResult.valid_count === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCommitting
                    ? 'Committing to DB...'
                    : !user
                    ? `🔒 HR Login Required to Commit (${validationResult.valid_count} Records)`
                    : `Commit Batch Import (${validationResult.valid_count} Records) ➔`}
                </button>
              </div>
            </div>

            {/* Scrollable Container with Horizontal and Vertical Scroll */}
            <div style={{ maxHeight: '380px', overflowX: 'auto', overflowY: 'auto' }}>
              {validationResult.validated.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                  No valid records available for import. Please review error records above.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#E0F2F1', position: 'sticky', top: 0, zIndex: 2 }}>
                    <tr>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C' }}>Row #</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C' }}>Emp Code</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C' }}>Name</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C' }}>Department</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C' }}>Country</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C' }}>Current Salary</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#2A9D8F' }}>Bonus Amount</th>
                      <th style={{ padding: '0.65rem 1rem', borderBottom: '2px solid #B2DFDB', color: '#0F4C5C', fontWeight: 700 }}>New Total Comp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResult.validated.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E0F2F1', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9FBFB' }}>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: '#666' }}>#{item.row_index}</td>
                        <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#0F4C5C' }}>{item.employee_code}</td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>{item.department}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>{item.country}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>${item.current_salary.toLocaleString()}</td>
                        <td style={{ padding: '0.65rem 1rem', color: '#2A9D8F', fontWeight: 700 }}>+${item.bonus_amount.toLocaleString()}</td>
                        <td style={{ padding: '0.65rem 1rem', color: '#0F4C5C', fontWeight: 700 }}>${item.new_total_compensation.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
