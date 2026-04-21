'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeColors } from '../theme/colors';

interface InterviewActiveProps {
  colors: ThemeColors;
  s: Record<string, React.CSSProperties>;
  onFinish: () => void;
  onPrepare: () => void;
}

const TOTAL_TIME = 20;
const PAUSED = false;

function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  return `00:${String(s).padStart(2, '0')}`;
}

export const InterviewActive: React.FC<InterviewActiveProps> = ({ colors, s, onFinish, onPrepare }) => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [displayWidth, setDisplayWidth] = useState('0%');

  const handleFinish = useCallback(onFinish, []);

  useEffect(() => {
    if (PAUSED) return;
    if (timeLeft <= 0) {
      onPrepare();
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        setDisplayWidth(`${((TOTAL_TIME - next) / TOTAL_TIME) * 100}%`);
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, onPrepare]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={s.subtitle}>Задание началось</p>
        </div>
      </div>

      <div style={{ ...s.whiteSheet, margin: 0, flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <div style={styles.taskCard}>
          <div style={styles.taskContent}>
            <div style={{ ...styles.badge, backgroundColor: colors.activeText }}>3</div>
            <p style={styles.taskText}>
              Task 3. You are going to give an interview. You have to answer five questions.
              Give full answers to the questions (2–3 sentences). Remember that you have 40
              seconds to answer each question.
            </p>
          </div>

          <div style={styles.controlsRow}>
            <div style={styles.progressBarWrapper}>
              <div style={styles.statusLabel}>
                <img src="/asserts/Microfon.png" alt="mic" style={styles.micIcon} />
                <span style={styles.preparationText}>Preparation</span>
              </div>

              <div style={styles.barBackground}>
                <div style={{ ...styles.barFill, width: displayWidth }} />
              </div>

              <div style={styles.timer}>{formatTime(timeLeft)}</div>
            </div>

            <button
              onClick={onPrepare}
              style={{ ...styles.finishBtn, backgroundColor: colors.activeText }}
            >
              Завершить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05), 0 1px 8px rgba(0,0,0,0.02)',
    border: '1px solid rgba(0,0,0,0.03)',
    fontFamily: "'Roboto', system-ui, sans-serif",
  },
  taskContent: {
    display: 'flex',
    gap: '15px',
    marginBottom: '80px',
  },
  badge: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
  },
  taskText: {
    margin: 0,
    fontSize: '24px',
    lineHeight: '1.5',
    color: '#334155',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '12px',
  },
  progressBarWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: '10px',
    overflow: 'hidden',
    borderTop: '4px solid #1a2b3c',
    borderBottom: '4px solid #1a2b3c',
    borderLeft: '1px solid #1a2b3c',
    borderRight: '1px solid #1a2b3c',
    height: '44px',
    boxSizing: 'border-box' as const,
  },
  statusLabel: {
    color: '#fff',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    borderRight: '1px solid rgba(255,255,255,0.15)',
    height: '100%',
  },
  micIcon: {
    width: '18px',
    height: '18px',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  preparationText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap' as const,
    fontFamily: "'Roboto', system-ui, sans-serif",
  },
  barBackground: {
    flex: 1,
    height: '100%',
    backgroundColor: '#D8E6F5',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#467AB6',
  },
  timer: {
    padding: '0 16px',
    fontWeight: '700',
    color: '#fff',
    fontSize: '16px',
    fontFamily: "'Roboto', monospace",
    minWidth: '64px',
    textAlign: 'right' as const,
    flexShrink: 0,
    borderLeft: '1px solid rgba(255,255,255,0.15)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  finishBtn: {
    padding: '10px 20px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Roboto', system-ui, sans-serif",
    flexShrink: 0,
  },
};