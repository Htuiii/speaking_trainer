'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { lightTheme, ThemeColors } from '../theme/colors';
import { TOPICS } from '../theme/topics'; 

import { TopicsScreen } from '../screen/TopicScreen';
import { MicCheckScreen } from '../screen/MicCheckScreen';
// 1. Импортируем новый экран
import { InterviewProcess } from '../screen/InterviewProcess';

export default function InterviewPage() {
  const colors = lightTheme;
  
  // 2. Добавляем 'countdown' и 'interview' в типы экрана
  const [currentScreen, setCurrentScreen] = useState<'topics' | 'mic-check' | 'countdown' | 'interview'>('topics');
  
  const [selectedTopic, setSelectedTopic] = useState<string>(''); 
  const [columns, setColumns] = useState(3);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#EEF2F6';
    document.body.style.overflowX = 'hidden';

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 900) setColumns(1);
      else if (width < 1300) setColumns(2);
      else setColumns(3);

      setIsSmallScreen(width < 1024);
      setIsMobile(width < 600);
      if (width >= 1024) setIsSidebarOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredTopics = useMemo(() => 
    TOPICS.filter(topic => topic.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const s = pageStyles(colors, columns, isSmallScreen, isMobile, isSidebarOpen);

  return (
    <div style={s.pageWrapper}>
      <Header colors={colors} />
      <div style={s.layout}>
        <div style={s.sidebarContainer}><Sidebar colors={colors} /></div>
        
        {isSmallScreen && isSidebarOpen && (
          <div style={s.overlay} onClick={() => setIsSidebarOpen(false)} />
        )}
        {isSmallScreen && (
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={s.burgerBtn}>
            {isSidebarOpen ? '✕' : '☰ Меню'}
          </button>
        )}

        <main style={s.main}>
          {/* ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ */}
          
          {currentScreen === 'topics' && (
            <TopicsScreen 
              filteredTopics={filteredTopics}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCardClick={(title) => {
                setSelectedTopic(title); 
                setCurrentScreen('mic-check'); 
              }}
              colors={colors}
              isMobile={isMobile}
              columns={columns}
              s={s}
            />
          )}

          {currentScreen === 'mic-check' && (
            <MicCheckScreen 
              onBack={() => setCurrentScreen('topics')} 
              colors={colors}
              s={s}
              selectedTopicTitle={selectedTopic} 
              onSelectTopic={(title) => setSelectedTopic(title)} 
              // 3. ВАЖНО: При успехе переходим на таймер
              onSuccess={() => setCurrentScreen('countdown')} 
            />
          )}

          {currentScreen === 'countdown' && (
            <InterviewProcess 
              colors={colors}
              s={s}
              topicTitle={selectedTopic}
            />
          )}

          {currentScreen === 'interview' && (
            <div style={s.whiteSheet}>
               <h1 style={s.h1}>Экран самого интервью</h1>
               <p style={s.subtitle}>Тут будет бот и запись ответа...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const pageStyles = (colors: ThemeColors, columns: number, isSmall: boolean, isMobile: boolean, isSidebarOpen: boolean): Record<string, React.CSSProperties> => ({
  pageWrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#EAF5FF', fontFamily: 'Roboto, system-ui, sans-serif' },
  layout: { display: 'flex', flex: 1, overflowX: 'hidden', position: 'relative' },
  sidebarContainer: { display: (isSmall && !isSidebarOpen) ? 'none' : 'block', position: isSmall ? 'fixed' : 'relative', top: isSmall ? '0' : 'auto', left: 0, bottom: 0, zIndex: 1001, backgroundColor: '#F8FAFC', boxShadow: isSmall ? '10px 0 20px rgba(0,0,0,0.1)' : 'none' },
  burgerBtn: { position: 'fixed', bottom: '20px', left: '20px', zIndex: 1002, padding: '12px 20px', backgroundColor: colors.headerBg, color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000 },
  main: { flex: 1, padding: isMobile ? '10px 16px' : '25px 40px', transition: 'all 0.2s ease', minWidth: 0 },
  topContent: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'flex-start', gap: isMobile ? '16px' : '24px', marginBottom: isMobile ? '15px' : '16px' },
  h1: { fontSize: isMobile ? '24px' : isSmall ? '32px' : '44px', color: colors.titleText, margin: 0, fontWeight: '700' },
  subtitle: { color: colors.activeText, fontSize: isMobile ? '14px' : '20px', fontWeight: '500', marginTop: '10px' },
  whiteSheet: { backgroundColor: '#FFF', borderRadius: isMobile ? '16px' : '24px', padding: isMobile ? '20px' : '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' },
  cardGrid: { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: isMobile ? '20px' : '40px' },
});