'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { lightTheme } from '../theme/colors';
import { TOPICS } from '../theme/topics';
import { TopicsScreen } from './TopicScreen';
import { MicCheckScreen } from './MicCheckScreen';
import { InterviewProcess } from './InterviewProcess';
import { InterviewActive } from './InterviewActive';
import { InterviewPrepare } from './InterviewPrepare';
import { InterviewStartTest } from './InterviewStartTest';
import { InterviewRecording } from './InterviewRecording';
import { FinishScreen } from './FinishScreen';
import { UnderDevelopmentScreen } from './UnderDevelopmentScreen';

type Screen = 'topics' | 'mic-check' | 'countdown' | 'interview' | 'prepare' | 'starttest' | 'recording' | 'finish';

function getColumns(width: number): number {
  if (width < 900) return 1;
  if (width < 1300) return 2;
  return 3;
}

export default function InterviewMainScreen() {
  const colors = lightTheme;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentScreen, setCurrentScreen] = useState<Screen>(
    () => (searchParams.get('step') as Screen) || 'topics'
  );
  const [selectedTopic, setSelectedTopic] = useState<string>(
    () => searchParams.get('topic') || ''
  );
  // Задание, которое сейчас активно
  const [activeTask, setActiveTask] = useState<number>(
    () => Number(searchParams.get('task') || '3')
  );

  const [columns, setColumns] = useState(3);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const step = (searchParams.get('step') as Screen) || 'topics';
    const topic = searchParams.get('topic') || '';
    const task = Number(searchParams.get('task') || '3');
    setCurrentScreen(step);
    setSelectedTopic(topic);
    setActiveTask(task);
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setColumns(getColumns(w));
      setIsSmallScreen(w < 1024);
      setIsMobile(w < 600);
      if (w >= 1024) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const { body } = document;
    const saved = {
      margin: body.style.margin,
      padding: body.style.padding,
      backgroundColor: body.style.backgroundColor,
      overflowX: body.style.overflowX,
    };
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.backgroundColor = '#EEF2F6';
    body.style.overflowX = 'hidden';
    return () => {
      body.style.margin = saved.margin;
      body.style.padding = saved.padding;
      body.style.backgroundColor = saved.backgroundColor;
      body.style.overflowX = saved.overflowX;
    };
  }, []);

  const noScrollScreens: Screen[] = ['mic-check', 'countdown', 'interview', 'prepare'];
  const internalScrollScreens: Screen[] = ['mic-check'];

  useEffect(() => {
    const shouldLock = noScrollScreens.includes(currentScreen);
    document.documentElement.style.overflowY = shouldLock ? 'hidden' : 'scroll';
    document.body.style.overflowY = shouldLock ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflowY = '';
      document.body.style.overflowY = '';
    };
  }, [currentScreen]);

  const navigateTo = useCallback(
    (step: Screen, topic?: string) => {
      const targetTopic = topic !== undefined ? topic : selectedTopic;
      const params = new URLSearchParams({ step, task: String(activeTask) });
      if (targetTopic) params.set('topic', targetTopic);
      router.push(`?${params.toString()}`);
    },
    [router, selectedTopic, activeTask]
  );

  const filteredTopics = useMemo(
    () => TOPICS.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  // Обработчик выбора задания из боковой панели
  const handleSidebarTaskSelect = useCallback(
    (id: number) => {
      setActiveTask(id);
      if (id === 3) {
        // Задание 3 — рабочее, идём на экран тем
        const params = new URLSearchParams({ step: 'topics', task: '3' });
        router.push(`?${params.toString()}`);
      } else {
        // Задания 1, 2, 4 — экран "в разработке"
        const params = new URLSearchParams({ task: String(id) });
        router.push(`?${params.toString()}`);
      }
      if (isSmallScreen) setIsSidebarOpen(false);
    },
    [router, isSmallScreen]
  );

  const noScroll = noScrollScreens.includes(currentScreen);
  const internalScroll = internalScrollScreens.includes(currentScreen);

  const s = useMemo(
    () => buildPageStyles(columns, isSmallScreen, isMobile, isSidebarOpen, noScroll, internalScroll),
    [columns, isSmallScreen, isMobile, isSidebarOpen, noScroll, internalScroll]
  );

  const isUndevelopedTask = activeTask !== 3;

  return (
    <div style={s.pageWrapper}>
      <Header colors={colors} />
      <div style={s.layout}>
        <div style={s.sidebarContainer}>
          <Sidebar
            colors={colors}
            activeTask={activeTask}
            onSelectTask={handleSidebarTaskSelect}
          />
        </div>

        {isSmallScreen && isSidebarOpen && (
          <div style={s.overlay} onClick={() => setIsSidebarOpen(false)} />
        )}
        {isSmallScreen && (
          <button
            style={s.burgerBtn}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isSidebarOpen ? '✕' : '☰ Меню'}
          </button>
        )}

        <main style={s.main}>
          {/* Экран "в разработке" для заданий 1, 2, 4 */}
          {isUndevelopedTask && (
            <UnderDevelopmentScreen taskNumber={activeTask} colors={colors} s={s} />
          )}

          {/* Экраны задания 3 */}
          {!isUndevelopedTask && currentScreen === 'topics' && (
            <TopicsScreen
              filteredTopics={filteredTopics}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCardClick={(title) => navigateTo('mic-check', title)}
              colors={colors}
              isMobile={isMobile}
              columns={columns}
              s={s}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'mic-check' && (
            <MicCheckScreen
              onBack={() => navigateTo('topics')}
              colors={colors}
              s={s}
              selectedTopicTitle={selectedTopic}
              onSelectTopic={setSelectedTopic}
              onSuccess={() => navigateTo('countdown')}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'countdown' && (
            <InterviewProcess
              colors={colors}
              s={s}
              topicTitle={selectedTopic}
              onFinish={() => navigateTo('interview')}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'interview' && (
            <InterviewActive
              colors={colors}
              s={s}
              onFinish={() => navigateTo('topics', '')}
              onPrepare={() => navigateTo('prepare')}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'prepare' && (
            <InterviewPrepare
              colors={colors}
              s={s}
              onFinish={() => navigateTo('starttest', '')}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'starttest' && (
            <InterviewStartTest
              colors={colors}
              s={s}
              topicTitle={selectedTopic}
              onFinish={() => navigateTo('recording')}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'recording' && (
            <InterviewRecording
              colors={colors}
              s={s}
              onFinish={() => navigateTo('finish')}
              questionNumber={1}
            />
          )}
          {!isUndevelopedTask && currentScreen === 'finish' && (
            <FinishScreen
              colors={colors}
              s={s}
              topicTitle={selectedTopic}
              onShowResults={() => navigateTo('topics')}
              onGoHome={() => navigateTo('topics', '')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function buildPageStyles(
  columns: number,
  isSmall: boolean,
  isMobile: boolean,
  isSidebarOpen: boolean,
  noScroll: boolean,
  internalScroll: boolean
): Record<string, React.CSSProperties> {
  return {
    pageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      ...(noScroll && { height: '100vh', overflow: 'hidden' }),
      backgroundColor: '#EAF5FF',
      fontFamily: 'Roboto, system-ui, sans-serif',
    },
    layout: {
      display: 'flex',
      flex: 1,
      width: '100%',
      position: 'relative',
      ...(noScroll && { overflow: 'hidden', minHeight: 0 }),
    },
    sidebarContainer: {
      display: isSmall && !isSidebarOpen ? 'none' : 'block',
      position: isSmall ? 'fixed' : 'relative',
      top: isSmall ? '0' : 'auto',
      left: 0,
      bottom: 0,
      zIndex: 1001,
      backgroundColor: '#F8FAFC',
      boxShadow: isSmall ? '10px 0 20px rgba(0,0,0,0.1)' : 'none',
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
      fontSize: '16px',
      fontWeight: '600',
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
    main: {
      flex: 1,
      padding: isMobile ? '10px 16px' : '25px 40px',
      transition: 'opacity 0.2s ease',
      minWidth: 0,
      ...(internalScroll && { overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }),
      ...(!internalScroll && noScroll && { overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }),
    },
    topContent: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'stretch' : 'flex-start',
      gap: isMobile ? '16px' : '24px',
      marginBottom: isMobile ? '15px' : '16px',
    },
    h1: {
      fontSize: isMobile ? '24px' : isSmall ? '32px' : '44px',
      color: '#1D3551',
      margin: 0,
      fontWeight: '700',
    },
    subtitle: {
      color: '#467AB6',
      fontSize: isMobile ? '14px' : '20px',
      fontWeight: '500',
      marginTop: '10px',
    },
    whiteSheet: {
      backgroundColor: '#F1F8FF',
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '20px' : '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: isMobile ? '20px' : '40px',
    },
  };
}