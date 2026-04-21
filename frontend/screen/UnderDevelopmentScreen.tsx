'use client';
import React, { useEffect, useState, useMemo } from 'react';

interface UnderDevelopmentScreenProps {
  taskNumber: number;
  colors?: { primary?: string; accent?: string };
  s?: Record<string, React.CSSProperties>; 
}

const TASK_LABELS: Record<number, string> = {
  1: 'Задание 1',
  2: 'Задание 2',
  4: 'Задание 4',
};

const TASK_DESCRIPTIONS: Record<number, string> = {
  1: 'Описание изображения',
  2: 'Диалог с экзаменатором',
  4: 'Монолог на заданную тему',
};

export const UnderDevelopmentScreen: React.FC<UnderDevelopmentScreenProps> = ({
  taskNumber,
  s,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Блокируем скролл на уровне документа
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const label = TASK_LABELS[taskNumber] ?? `Задание ${taskNumber}`;
  const description = TASK_DESCRIPTIONS[taskNumber] ?? '';

  const styles = useMemo(() => buildLocalStyles(mounted, s), [mounted, s]);

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.iconStage}>
            <div style={styles.ringPulse} />
            <div style={styles.ringOuter} />
            <div style={styles.ringInner} />
            <div style={styles.iconCore}>
              <span style={styles.iconEmoji}>Logo</span>
            </div>
          </div>

          <h1 style={styles.title}>{label}</h1>
          {description && <p style={styles.subtitle}>{description}</p>}

          <div style={styles.divider} />

          <p style={styles.desc}>
            Мы активно работаем над этим разделом. Скоро он станет доступен — следите за обновлениями!
          </p>

          <div style={styles.dots}>
            <div style={styles.dot1} />
            <div style={styles.dot2} />
            <div style={styles.dot3} />
          </div>

          <div style={styles.tag}>
            <span style={styles.tagDot} />
            Раздел скоро будет готов
          </div>
        </div>
      </div>
    </>
  );
};

function buildLocalStyles(mounted: boolean, s?: Record<string, React.CSSProperties>): Record<string, React.CSSProperties> {
  const primaryColor = '#1D3551';
  const accentColor = '#467AB6';

  return {
    wrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    },
    card: {
      position: 'relative',
      zIndex: 2,
      backgroundColor: '#F1F8FF', // Твой whiteSheet
      borderRadius: '24px',
      padding: '60px 40px',
      maxWidth: '600px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    iconStage: {
      position: 'relative',
      width: '120px',
      height: '120px',
      margin: '0 auto 30px',
      animation: 'float 4s ease-in-out infinite',
    },
    ringOuter: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      border: `2px dashed rgba(70, 122, 182, 0.25)`,
      animation: 'spin-slow 12s linear infinite',
    },
    ringInner: {
      position: 'absolute',
      inset: '12px',
      borderRadius: '50%',
      border: `1px dashed rgba(29, 53, 81, 0.15)`,
      animation: 'spin-reverse 8s linear infinite',
    },
    ringPulse: {
      position: 'absolute',
      inset: '-10px',
      borderRadius: '50%',
      border: `1px solid rgba(70, 122, 182, 0.2)`,
      animation: 'pulse-ring 3s ease-in-out infinite',
    },
    iconCore: {
      position: 'absolute',
      inset: '20px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 25px rgba(29, 53, 81, 0.2)',
    },
    iconEmoji: { 
      fontSize: '20px', 
      color: '#fff', 
      fontWeight: 'bold',
      fontFamily: "'Unbounded', sans-serif" 
    },
    title: {
      fontFamily: "'Unbounded', sans-serif",
      fontSize: s?.h1?.fontSize || '44px',
      fontWeight: 700,
      color: primaryColor,
      margin: 0,
      lineHeight: '1.2',
    },
    subtitle: {
      fontFamily: "'Mulish', sans-serif",
      fontSize: s?.subtitle?.fontSize || '20px',
      color: accentColor,
      fontWeight: 500,
      marginTop: '10px',
      marginBottom: '30px',
    },
    divider: {
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(70,122,182,0.2), transparent)',
      margin: '0 auto 30px',
      width: '60%',
    },
    desc: {
      fontSize: '16px',
      color: '#64748B',
      lineHeight: '1.6',
      marginBottom: '40px',
    },
    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px',
    },
    dot1: { width: '8px', height: '8px', borderRadius: '50%', background: accentColor, animation: 'dot-bounce 1.4s infinite 0s' },
    dot2: { width: '8px', height: '8px', borderRadius: '50%', background: accentColor, animation: 'dot-bounce 1.4s infinite 0.2s' },
    dot3: { width: '8px', height: '8px', borderRadius: '50%', background: accentColor, animation: 'dot-bounce 1.4s infinite 0.4s' },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(29,53,81,0.05)',
      borderRadius: '30px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 600,
      color: primaryColor,
    },
    tagDot: { width: '6px', height: '6px', borderRadius: '50%', background: accentColor }
  };
}