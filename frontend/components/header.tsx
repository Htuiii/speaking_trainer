'use client';

import React from 'react';
import { ThemeColors } from '../theme/colors';

interface HeaderProps {
  colors: ThemeColors;
}

export const Header: React.FC<HeaderProps> = ({ colors }) => {
  return (
    <header style={{
      backgroundColor: colors.headerBg,
      color: '#FFF',
      padding: '12px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Logo :)</div>
      <div style={{ display: 'flex', gap: '30px', fontSize: '15px', fontWeight: 'bold' }}>
        <span style={{ cursor: 'pointer' }}>Войти</span>
        <span style={{ cursor: 'pointer' }}>Регистрация</span>
      </div>
    </header>
  );
};