'use client';

import React, { memo } from 'react';
import { ThemeColors } from '../theme/colors';

interface SearchSectionProps {
  colors: ThemeColors;
  isMobile: boolean;
  value: string;
  onChange: (val: string) => void;
}

// 1. Сначала объявляем компонент как обычную функцию
const SearchSectionComponent: React.FC<SearchSectionProps> = ({ colors, isMobile, value, onChange }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      maxWidth: isMobile ? '100%' : '350px',
      marginTop: isMobile ? '0' : '6px',
      flexShrink: 1,
    }}>
      <input 
        type="text" 
        placeholder="Поиск по темам..." 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          height: isMobile ? '44px' : '52px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px 0 0 16px',
          border: `1px solid ${colors.headerBg}`,
          padding: '0 15px', 
          outline: 'none', 
          fontSize: '16px',
          minWidth: 0,
        }} 
      />
      <div style={{
        backgroundColor: colors.headerBg,
        width: isMobile ? '44px' : '52px',
        height: isMobile ? '44px' : '52px',
        borderRadius: '0 16px 16px 0',
        border: `1px solid ${colors.headerBg}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: '0 4px 10px rgba(74, 144, 226, 0.15)',
      }}>
        <SearchIcon size={26} color="white" />
      </div>
    </div>
  );
};

// 2. Экспортируем обернутый в memo компонент
export const SearchSection = memo(SearchSectionComponent);

// Название для отладки
SearchSection.displayName = 'SearchSection';

const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);