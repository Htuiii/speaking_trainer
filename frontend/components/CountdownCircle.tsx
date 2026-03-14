'use client';
import React from 'react';
import { ThemeColors } from '../theme/colors';

export const CountdownCircle = ({ seconds, colors }: { seconds: number, colors: ThemeColors }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (seconds / 5) * circumference;

  return (
    <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ position: 'absolute', width: '120px', height: '120px', transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={colors.button}
          strokeWidth="8"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span style={{ fontSize: '56px', fontWeight: '600', color: colors.button }}>{seconds}</span>
    </div>
  );
};