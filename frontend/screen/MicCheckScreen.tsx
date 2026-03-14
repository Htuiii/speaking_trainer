'use client';

import React, { memo, useState, useEffect, useMemo } from 'react';
import { ThemeColors } from '../theme/colors';
import { TOPICS } from '../theme/topics';

// Описываем пропсы, чтобы TypeScript не ругался
interface MicCheckScreenProps {
  onBack: () => void;
  colors: ThemeColors;
  s: Record<string, React.CSSProperties>; 
  selectedTopicTitle: string;
  onSelectTopic: (title: string) => void;
  onSuccess?: () => void;
}

export const MicCheckScreen: React.FC<MicCheckScreenProps> = ({ 
  onBack, 
  colors, 
  s, 
  selectedTopicTitle,
  onSelectTopic,
  onSuccess
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [btnHover, setBtnHover] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isWide = windowWidth > 1100;

  // Оптимизация: стили пересчитываются только при изменении ключевых параметров
  const styles = useMemo(() => getStyles(colors, isWide, micStatus, btnHover), [colors, isWide, micStatus, btnHover]);

  const handleMicRequest = async () => {
  setMicStatus('requesting');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setMicStatus('success');
    stream.getTracks().forEach(track => track.stop());

    // Вызываем переход на следующий экран
    if (onSuccess) {
      setTimeout(() => {
        onSuccess(); // Переключаем на 'countdown'
      }, 500); // Небольшая задержка для красоты
    }
  } catch (err) {
    setMicStatus('error');
    alert('Нужен доступ к микрофону');
  }
};

  const handleTopicClick = (title: string) => {
    onSelectTopic(title);
    if (!isWide) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      {/* 1. ЗАГОЛОВОК (стили из пропса s) */}
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={s.subtitle}>Проверка оборудования</p>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* 2. ЛЕВАЯ ЧАСТЬ */}
        <div style={styles.contentLeft}>
          <div style={{ ...s.whiteSheet, margin: 0, flex: 1 }}>
            <div style={styles.micAlertCard}>
              <p style={styles.alertText}>
                Сейчас приложение запросит <span style={styles.highlight}>доступ к микрофону</span>.
                <br />
                Пожалуйста, <span style={styles.highlight}>разрешите</span> использование в появившемся окне браузера — это необходимо для записи устных ответов.
              </p>
              
              <div style={styles.btnRow}>
                <button 
                  style={styles.primaryBtn}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  onClick={handleMicRequest}
                  disabled={micStatus === 'requesting'}
                >
                  {micStatus === 'requesting' ? 'Ожидание...' : 'Понятно'}
                </button>
              </div>
            </div>

            <button onClick={onBack} style={styles.backLink}>
              ← Вернуться к выбору тем
            </button>
          </div>
        </div>

        {/* 3. ПРАВАЯ ЧАСТЬ */}
        <aside style={styles.topicsAside}>
          <h4 style={styles.asideTitle}>Все темы задания 3. Interview:</h4>
          <div style={styles.scrollArea}>
            {TOPICS.map((topic) => (
              <TopicItem 
                key={topic.title} 
                topic={topic} 
                isSelected={topic.title === selectedTopicTitle}
                colors={colors}
                onClick={() => handleTopicClick(topic.title)}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const TopicItem = memo(({ topic, isSelected, colors, onClick }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Безопасное получение пути картинки
  const imgSrc = topic.img?.src || topic.img;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: colors.cardBg,
        boxShadow: isSelected 
          ? `0 0 0 3px ${colors.activeText}, 0 12px 24px rgba(0,0,0,0.15)` 
          : isHovered ? '0 8px 20px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.08)',
        transform: isSelected || isHovered ? 'scale(1.02)' : 'scale(1)',
        zIndex: isSelected ? 2 : 1,
        opacity: isSelected ? 1 : 0.85,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <div style={{ width: '100%', height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
        <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        {isSelected && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: colors.activeText, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            Выбрано
          </div>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <span style={{ fontSize: '18px', fontWeight: '700', display: 'block', marginBottom: '8px', color: isSelected ? colors.activeText : colors.titleText }}>
          {topic.title}
        </span>
        <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0, color: colors.mutedText }}>{topic.desc}</p>
      </div>
    </div>
  );
});

TopicItem.displayName = 'TopicItem';

// --- ФУНКЦИЯ СТИЛЕЙ В КОНЦЕ ---

const getStyles = (colors: ThemeColors, isWide: boolean, micStatus: string, btnHover: boolean): Record<string, React.CSSProperties> => ({
  page: { display: 'flex', flexDirection: 'column', width: '100%' },
  mainLayout: { display: 'flex', flexDirection: isWide ? 'row' : 'column', gap: '40px', width: '100%' },
  contentLeft: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  micAlertCard: {
    backgroundColor: colors.cardBg,
    borderRadius: '12px',
    padding: '24px 32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  alertText: { fontSize: '21px', lineHeight: '1.5', margin: 0, color: colors.titleText },
  highlight: { color: colors.activeText, fontWeight: '600' },
  btnRow: { display: 'flex', justifyContent: 'flex-end' },
  primaryBtn: {
    backgroundColor: btnHover ? (colors.buttonHover || '#7EB2EE') : colors.button,
    color: 'white', border: 'none', borderRadius: '8px', padding: '10px 28px',
    fontSize: '16px', fontWeight: '600',
    cursor: micStatus === 'requesting' ? 'default' : 'pointer',
    opacity: micStatus === 'requesting' ? 0.7 : 1,
    transition: 'background-color 0.2s ease',
  },
  backLink: {
    background: 'none', border: 'none', marginTop: '40px', cursor: 'pointer',
    fontSize: '16px', color: colors.mutedText, width: 'fit-content'
  },
  topicsAside: {
    width: isWide ? '500px' : '100%', flexShrink: 0,
    position: isWide ? 'sticky' : ('static' as any),
    top: '20px', marginTop: isWide ? '-135px' : '0', zIndex: 10, paddingBottom: '40px'
  },
  asideTitle: { margin: '0 0 15px 0', fontSize: '22px', fontWeight: '700', paddingLeft: '10px', color: colors.titleText },
  scrollArea: {
    display: 'flex', flexDirection: 'column', gap: '40px',
    padding: '15px 20px 40px 15px', maxHeight: isWide ? '85vh' : 'none',
    overflowY: isWide ? 'auto' : 'visible'
  }
});