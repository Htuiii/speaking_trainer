'use client';

import React from 'react';
import { ThemeColors } from '../theme/colors';

interface FinishScreenProps {
  colors: ThemeColors;
  s: Record<string, React.CSSProperties>;
  topicTitle: string;
  onShowResults?: () => void;
  onGoHome?: () => void;
}

export const FinishScreen: React.FC<FinishScreenProps> = ({
  colors,
  s,
  topicTitle,
  onShowResults,
  onGoHome,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={{ ...s.subtitle, color: colors.activeText }}>Тестирование завершено</p>
        </div>
      </div>

      <div style={{ ...s.whiteSheet, margin: 0, flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
        <div style={cardStyle}>
          <div style={contentBoxStyle}>
            <h2 style={titleStyle}>Thank you for the interview</h2>
            <div style={buttonsStyle}>
              <button
                onClick={onShowResults}
                style={primaryBtnStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3B82F6';
                }}
              >
                Показать результаты
              </button>
              <button
                onClick={onGoHome}
                style={secondaryBtnStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff';
                }}
              >
                Вернуться на главную
              </button>
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

const contentBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  marginBottom: '32px',
  color: '#2D3E50',
  fontWeight: '700',
  fontFamily: "'Roboto', system-ui, sans-serif",
};

const buttonsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  alignItems: 'center',
};

const primaryBtnStyle: React.CSSProperties = {
  width: '220px',
  padding: '12px 24px',
  backgroundColor: '#3B82F6',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  fontFamily: "'Roboto', system-ui, sans-serif",
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

const secondaryBtnStyle: React.CSSProperties = {
  width: '220px',
  padding: '12px 24px',
  backgroundColor: '#ffffff',
  color: '#334155',
  border: '1.5px solid #CBD5E1',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  fontFamily: "'Roboto', system-ui, sans-serif",
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};