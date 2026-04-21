'use client';

import React, { memo, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ThemeColors } from '../theme/colors';
import { TOPICS } from '../theme/topics';

interface MicCheckScreenProps {
  onBack: () => void;
  colors: ThemeColors;
  s: Record<string, React.CSSProperties>;
  selectedTopicTitle: string;
  onSelectTopic: (title: string) => void;
  onSuccess?: () => void;
}

type MicStatus = 'idle' | 'requesting' | 'success' | 'error';

interface UseMicResult {
  status: MicStatus;
  volume: number;
  request: () => Promise<void>;
  stop: () => void;
}

function useMic(): UseMicResult {
  const [status, setStatus] = useState<MicStatus>('idle');
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const request = useCallback(async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx() as AudioContext;
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
        setVolume(avg);
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();

      setStatus('success');
    } catch {
      setStatus('error');
      alert('Нужен доступ к микрофону');
    }
  }, []);

  useEffect(() => stop, [stop]);

  return { status, volume, request, stop };
}

interface TopicItemProps {
  topic: { title: string; desc: string; img: string | { src: string } };
  isSelected: boolean;
  colors: ThemeColors;
  onClick: () => void;
}

const TopicItem = memo<TopicItemProps>(({ topic, isSelected, colors, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const imgSrc = typeof topic.img === 'string' ? topic.img : topic.img.src;

  const style: React.CSSProperties = {
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: colors.cardBg,
    boxShadow: isSelected
      ? `0 0 0 3px ${colors.activeText}, 0 12px 24px rgba(0,0,0,0.15)`
      : isHovered
      ? '0 8px 20px rgba(0,0,0,0.12)'
      : '0 4px 12px rgba(0,0,0,0.08)',
    transform: isSelected || isHovered ? 'scale(1.02)' : 'scale(1)',
    zIndex: isSelected ? 2 : 1,
    opacity: isSelected ? 1 : 0.85,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    marginBottom: '40px',
  };

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: '100%',
          height: '180px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px 20px 0 0',
        }}
      >
        <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: colors.activeText,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Выбрано
          </div>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <span
          style={{
            fontSize: '18px',
            fontWeight: '700',
            display: 'block',
            marginBottom: '8px',
            color: isSelected ? colors.activeText : colors.titleText,
          }}
        >
          {topic.title}
        </span>
        <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0, color: colors.mutedText }}>
          {topic.desc}
        </p>
      </div>
    </div>
  );
});

TopicItem.displayName = 'TopicItem';

export const MicCheckScreen: React.FC<MicCheckScreenProps> = ({
  onBack,
  colors,
  s,
  selectedTopicTitle,
  onSelectTopic,
  onSuccess,
}) => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [btnHover, setBtnHover] = useState(false);
  const mic = useMic();

  const topicRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedTopicTitle) return;
    const timer = setTimeout(() => {
      const el = topicRefs.current[selectedTopicTitle];
      const container = scrollAreaRef.current;
      if (!el || !container) return;
      const elOffsetTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const containerHeight = container.offsetHeight;
      container.scrollTo({
        top: elOffsetTop - containerHeight / 2 + elHeight / 2,
        behavior: 'smooth',
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedTopicTitle]);

  const isWide = windowWidth === null ? true : windowWidth > 1100;
  const styles = useMemo(() => getStyles(colors, isWide, mic.status, btnHover), [colors, isWide, mic.status, btnHover]);

  const handleTopicClick = useCallback(
    (title: string) => {
      onSelectTopic(title);
    },
    [onSelectTopic]
  );

  const handleContinue = useCallback(() => {
    mic.stop();
    onSuccess?.();
  }, [mic, onSuccess]);

  if (windowWidth === null) return <div style={{ minHeight: '80vh' }} />;

  const volumeBarWidth = mic.status === 'success' ? `${Math.min(mic.volume * 2.5, 100)}%` : '0%';

  return (
    <div style={styles.page}>
      <div style={s.topContent}>
        <div style={{ flex: 1 }}>
          <h1 style={s.h1}>ЕГЭ; Задание 3. Interview</h1>
          <p style={s.subtitle}>Проверка оборудования</p>
        </div>
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.contentLeft}>
          <div style={{ ...s.whiteSheet, margin: 0, flex: 1, minHeight: 0 }}>
            <div style={styles.micAlertCard}>
              <p style={styles.alertText}>
                Сейчас приложение запросит{' '}
                <span style={styles.highlight}>доступ к микрофону</span>.
                <br />
                Пожалуйста,{' '}
                <span style={styles.highlight}>разрешите</span> использование в
                появившемся окне браузера — это необходимо для записи устных ответов.
              </p>

=              <div style={styles.vizWrapper}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: colors.titleText }}>
                    {mic.status === 'success' ? 'Микрофон активен' : 'Ожидание подключения...'}
                  </span>
                  {mic.status === 'success' && (
                    <span style={{ fontSize: '13px', color: colors.activeText }}>Говорите!</span>
                  )}
                </div>
                <div style={styles.vizTrack}>
                  <div
                    style={{
                      ...styles.vizFill,
                      width: volumeBarWidth,
                      backgroundColor: colors.activeText,
                      boxShadow: mic.volume > 10 ? `0 0 10px ${colors.activeText}88` : 'none',
                    }}
                  />
                </div>
              </div>

              <div style={styles.btnRow}>
                {mic.status !== 'success' ? (
                  <button
                    style={styles.primaryBtn}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    onClick={mic.request}
                    disabled={mic.status === 'requesting'}
                  >
                    {mic.status === 'requesting' ? 'Ожидание...' : 'Понятно'}
                  </button>
                ) : (
                  <button
                    style={styles.primaryBtn}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    onClick={handleContinue}
                  >
                    Продолжить
                  </button>
                )}
              </div>
            </div>

            <button onClick={onBack} style={styles.backLink}>
              ← Вернуться к выбору тем
            </button>
          </div>
        </div>

        <aside style={styles.topicsAside}>
          <h4 style={styles.asideTitle}>Все темы задания 3. Interview:</h4>
          <div style={styles.scrollArea} ref={scrollAreaRef}>
            {TOPICS.map((topic) => (
              <div
                key={topic.title}
                ref={(el) => {
                  topicRefs.current[topic.title] = el;
                }}
              >
                <TopicItem
                  topic={topic}
                  isSelected={topic.title === selectedTopicTitle}
                  colors={colors}
                  onClick={() => handleTopicClick(topic.title)}
                />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

function getStyles(
  colors: ThemeColors,
  isWide: boolean,
  micStatus: MicStatus,
  btnHover: boolean
): Record<string, React.CSSProperties> {
  return {
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
    alertText: { fontSize: '23px', lineHeight: '1.5', margin: 0, color: colors.titleText },
    highlight: { color: colors.activeText, fontWeight: '600' },
    vizWrapper: {
      marginTop: '5px',
      padding: '16px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #eee',
    },
    vizTrack: {
      width: '100%',
      height: '10px',
      backgroundColor: '#e2e8f0',
      borderRadius: '5px',
      overflow: 'hidden',
    },
    vizFill: { height: '100%', transition: 'width 0.05s linear' },
    btnRow: { display: 'flex', justifyContent: 'flex-end' },
    primaryBtn: {
      backgroundColor: btnHover ? (colors.buttonHover ?? '#7EB2EE') : colors.button,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 28px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: micStatus === 'requesting' ? 'default' : 'pointer',
      opacity: micStatus === 'requesting' ? 0.7 : 1,
      transition: 'background-color 0.2s ease',
    },
    backLink: {
      background: 'none',
      border: 'none',
      marginTop: '40px',
      cursor: 'pointer',
      fontSize: '16px',
      color: colors.mutedText,
      width: 'fit-content',
    },
    topicsAside: {
      width: isWide ? '500px' : '100%',
      flexShrink: 0,
      position: isWide ? 'sticky' : 'static',
      top: isWide ? '0px' : 'auto',
      marginTop: isWide ? '-135px' : '0',
      height: isWide ? 'calc(100vh - 60px)' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '20px',
    },
    asideTitle: {
      margin: '0 0 15px 0',
      fontSize: '22px',
      fontWeight: '700',
      paddingLeft: '10px',
      color: colors.titleText,
      flexShrink: 0,
    },
    scrollArea: {
      display: 'flex',
      flexDirection: 'column',
      padding: '15px 20px 40px 15px',
      overflowY: 'auto',
      flex: 1,
    },
  };
}