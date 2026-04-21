'use client';

import React, { useState, useEffect } from 'react';
import { ThemeColors } from '../theme/colors';

interface InterviewRecordingProps {
  colors: ThemeColors;
  s: Record<string, React.CSSProperties>;
  onFinish: () => void;
  questionNumber?: number;
}

type StepMode = 'question' | 'recording';

const QUESTION_TIME = 5;
const RECORD_TIME = 40;

export const InterviewRecording: React.FC<InterviewRecordingProps> = ({ 
  colors, 
  s, 
  onFinish, 
  questionNumber = 1 
}) => {
  const [mode, setMode] = useState<StepMode>('question');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [displayWidth, setDisplayWidth] = useState('0%');

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        if (next < 0) {
          if (mode === 'question') {
            setMode('recording');
            setDisplayWidth('0%');
            return RECORD_TIME;
          } else {
            onFinish();
            clearInterval(id);
            return 0;
          }
        }

        if (mode === 'recording') {
          const progress = ((RECORD_TIME - next) / RECORD_TIME) * 100;
          setDisplayWidth(`${progress}%`);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [mode, onFinish]);

  const isRecording = mode === 'recording';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={{ ...s.subtitle, color: isRecording ? '#E67E22' : colors.activeText }}>
            {isRecording ? 'Идет запись ответа...' : 'Слушайте вопрос'}
          </p>
        </div>
      </div>

      <div style={{ ...s.whiteSheet, margin: 0, flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <div style={styles.taskCard}>
          <div style={styles.taskContent}>
            <div style={{ ...styles.badge, backgroundColor: colors.activeText }}>3</div>
            <p style={styles.taskText}>Task 3. Interviewer: question {questionNumber}</p>
          </div>

          <div style={styles.controlsRow}>
            <div style={{ 
              ...styles.progressBarWrapper,
              backgroundColor: isRecording ? '#1E293B' : '#2C3E50',
            }}>
              <div style={styles.statusLabel}>
                <img 
                  src="/asserts/Microfon.png" 
                  alt="mic" 
                  style={{ 
                    ...styles.micIcon, 
                    filter: isRecording 
                      ? 'brightness(0) invert(1) sepia(1) saturate(5000%) hue-rotate(0deg)' 
                      : 'brightness(0) invert(1)',
                  }} 
                />
                <span style={styles.preparationText}>
                  {isRecording ? 'Recording' : 'Listening'}
                </span>
              </div>

              <div style={styles.barBackground}>
                <div style={{ 
                  ...styles.barFill, 
                  width: isRecording ? displayWidth : '0%',
                  backgroundColor: isRecording ? '#E67E22' : 'transparent',
                  transition: 'none',
                }} />
              </div>

              <div style={styles.timer}>
                00:{String(timeLeft).padStart(2, '0')}
              </div>
            </div>

            <button
              disabled={!isRecording}
              onClick={isRecording ? onFinish : undefined}
              style={{ 
                ...styles.finishBtn, 
                backgroundColor: isRecording ? '#3182CE' : '#929EAC',
                cursor: isRecording ? 'pointer' : 'not-allowed',
                opacity: isRecording ? 1 : 0.8,
              }}
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
    marginBottom: '116px',
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
    objectFit: 'contain' as const,
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
    fontSize: '14px',
    fontFamily: "'Roboto', system-ui, sans-serif",
    flexShrink: 0,
  },
};