import React from 'react';
import { HRTask } from '../lib/api';

type TeamTaskBoardProps = {
  tasks: HRTask[];
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  high: { bg: '#fdf0ed', text: '#b84328' },
  medium: { bg: '#fffbeb', text: '#92400e' },
  low: { bg: '#f0fdf4', text: '#166534' },
};

export default function TeamTaskBoard({ tasks }: TeamTaskBoardProps) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="feature-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F4C5C' }}>
            HR Team Specialist Workload (6 Members)
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#5C5C5C', marginTop: '0.15rem' }}>
            Operational tickets and compliance tasks assigned across your HR specialist team.
          </p>
        </div>
        <span style={{ fontSize: '0.825rem', color: '#5C5C5C', fontWeight: 500 }}>
          {tasks.length} active team tickets
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {tasks.map((task) => {
          const prio = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
          const statusLabel = task.status === 'in_progress' ? 'In Progress' : task.status.toUpperCase();

          return (
            <div
              key={task.id}
              style={{
                background: '#ffffff',
                border: '1px solid #E5E2DC',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: prio.bg,
                      color: prio.text,
                    }}
                  >
                    {task.priority} priority
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Due: {task.due_date}
                  </span>
                </div>

                <h4
                  title={task.title}
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    marginBottom: '0.4rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'help',
                  }}
                >
                  {task.title}
                </h4>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  title={task.assigned_to}
                  style={{
                    fontSize: '0.775rem',
                    color: '#5C5C5C',
                    maxWidth: '170px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'help',
                  }}
                >
                  👤 {task.assigned_to}
                </span>

                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: task.status === 'in_progress' ? '#0369a1' : '#475569',
                    background: task.status === 'in_progress' ? '#e0f2fe' : '#f1f5f9',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                  }}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
