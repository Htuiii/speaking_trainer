'use client';
import React, { useMemo } from 'react';
import { ThemeColors } from '../theme/colors';

interface CountdownCircleProps {
  seconds: number;
  totalSeconds: number;
  colors: ThemeColors;
}

export const CountdownCircle: React.FC<CountdownCircleProps> = ({ 
  seconds, 
  totalSeconds, 
  colors 
}) => {
  const radius = 54;
  const strokeWidth = 8;
  const size = 120;
  const center = size / 2;
  
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const offset = useMemo(() => {
    const progress = seconds / totalSeconds;
    return circumference * (1 - progress);
  }, [seconds, totalSeconds, circumference]);

  return (
    <div style={styles.container}>
      <svg width={size} height={size} style={styles.svg}>
        {/* Фоновый круг (серый) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Активный круг (прогресс) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.button}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      <span style={{ ...styles.number, color: colors.button }}>
        {seconds}
      </span>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: 'rotate(-90deg)',
  },
  number: {
    fontSize: '56px',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
  }
};