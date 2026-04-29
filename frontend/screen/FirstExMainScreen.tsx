'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { lightTheme } from '../theme/colors';
import { UnderDevelopmentScreen } from './UnderDevelopmentScreen';

export default function InterviewTask1Screen() {
  const colors = lightTheme;
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsSmallScreen(w < 1024);
      setIsMobile(w < 600);
      if (w >= 1024) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Глобальное отключение скролла для всей страницы
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const s = useMemo(
    () => buildPageStyles(isSmallScreen, isMobile, isSidebarOpen),
    [isSmallScreen, isMobile, isSidebarOpen]
  );

  return (
    <div style={s.pageWrapper}>
      <Header colors={colors} />
      
      <div style={s.layout}>
        {/* Боковая панель */}
        <div style={s.sidebarContainer}>
          <Sidebar
            colors={colors}
            activeTask={1} // Для этого экрана всегда 1
            onSelectTask={(id) => {
              // Тут логика перехода на другие страницы через router.push
              console.log('Переход на задание:', id);
            }}
          />
        </div>

        {/* Оверлей для мобилок */}
        {isSmallScreen && isSidebarOpen && (
          <div style={s.overlay} onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Бургер-кнопка */}
        {isSmallScreen && (
          <button
            style={s.burgerBtn}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? '✕' : '☰ Меню'}
          </button>
        )}

        <main style={s.main}>
          <UnderDevelopmentScreen taskNumber={1} colors={colors} s={s} />
        </main>
      </div>
    </div>
  );
}

function buildPageStyles(
  isSmall: boolean,
  isMobile: boolean,
  isSidebarOpen: boolean
): Record<string, React.CSSProperties> {
  return {
    pageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', // Фиксированная высота экрана
      overflow: 'hidden', // Отключаем скролл
      backgroundColor: '#EEF2F6',
      fontFamily: 'Roboto, system-ui, sans-serif',
    },
    layout: {
      display: 'flex',
      flex: 1,
      width: '100%',
      position: 'relative',
      overflow: 'hidden', // Отключаем внутренний скролл лейаута
    },
    sidebarContainer: {
      display: isSmall && !isSidebarOpen ? 'none' : 'block',
      position: isSmall ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 1001,
      backgroundColor: '#F8FAFC',
    },
    main: {
      flex: 1,
      padding: isMobile ? '10px 16px' : '25px 40px',
      position: 'relative',
      overflow: 'hidden', 
      display: 'flex',
      flexDirection: 'column',
    },
    h1: {
      fontSize: isMobile ? '24px' : isSmall ? '32px' : '44px',
      color: '#1D3551',
      fontWeight: '700',
    },
    subtitle: {
      color: '#467AB6',
      fontSize: isMobile ? '14px' : '20px',
      fontWeight: '500',
    },
    burgerBtn: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1002,
      padding: '12px 20px',
      backgroundColor: '#1D3551',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 1000,
    },
  };
}