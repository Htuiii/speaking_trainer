'use client';

import React, { useState, useEffect } from 'react';
import { ThemeColors } from '../theme/colors';
import { CountdownCircle } from '../components/CountdownCircle';

interface InterviewStartTestProps {
  colors: ThemeColors;
  s: Record<string, React.CSSProperties>;
  topicTitle: string;
  onFinish?: () => void;
}

const COUNTDOWN_SECONDS = 5;

export const InterviewStartTest: React.FC<InterviewStartTestProps> = ({
  colors,
  s,
  topicTitle,
  onFinish,
}) => {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      onFinish?.();
      return;
    }
    const id = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, onFinish]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>
      {/* Page header */}
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={{ ...s.subtitle, color: colors.activeText }}>Начало тестирования</p>
        </div>
      </div>

      <div style={{ ...s.whiteSheet, margin: 0, flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <div style={cardStyle}>
          <div style={countdownBoxStyle}>
            <h2 style={countdownTitleStyle}>Be ready to answer</h2>
            <div style={circleWrapperStyle}>
              <CountdownCircle
                seconds={seconds}
                totalSeconds={COUNTDOWN_SECONDS}
                colors={colors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  padding: '80px 230px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05), 0 1px 8px rgba(0,0,0,0.02)',
  maxWidth: '1000px',  
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(0,0,0,0.03)',
};

const countdownBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const countdownTitleStyle: React.CSSProperties = {
  fontSize: '24px',    
  marginBottom: '30px',
  color: '#2D3E50',
  fontWeight: '600',
};

const circleWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};