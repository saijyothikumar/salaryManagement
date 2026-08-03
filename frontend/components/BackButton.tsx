'use client';

import React from 'react';
import Link from 'next/link';

type BackButtonProps = {
  label?: string;
  href?: string;
};

export default function BackButton({ label = '← Back to Command Center', href = '/' }: BackButtonProps) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <Link
        href={href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#0F4C5C',
          background: '#ffffff',
          border: '1px solid #E5E2DC',
          padding: '0.4rem 0.85rem',
          borderRadius: '6px',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {label}
      </Link>
    </div>
  );
}
