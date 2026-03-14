'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeColors } from '../theme/colors';
import { CountdownCircle } from '../components/CountdownCircle';

interface InterviewProcessProps {
  colors: ThemeColors;
  s: any;
  topicTitle: string;
}

export const InterviewProcess: React.FC<InterviewProcessProps> = ({ colors, s, topicTitle }) => {
  const router = useRouter();
  const [phase, setPhase] = useState<'countdown' | 'interview'>('countdown');
  const [seconds, setSeconds] = useState(5);

  // Логика таймера
  useEffect(() => {
    if (phase === 'countdown') {
      if (seconds > 0) {
        const t = setTimeout(() => setSeconds(seconds - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setPhase('interview');
      }
    }
  }, [seconds, phase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={s.subtitle}>{phase === 'countdown' ? 'Приготовьтесь' : `Тема: ${topicTitle}`}</p>
        </div>
      </div>

      <div style={s.whiteSheet}>
        {phase === 'countdown' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '40px', color: '#2D3E50' }}>Be ready for the test</h2>
            <CountdownCircle seconds={seconds} colors={colors} />
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Интервью началось!</h2>
            {/* Здесь будет логика вопросов бота */}
            <button 
                onClick={() => router.push('/')} 
                style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Выйти (Esc)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};