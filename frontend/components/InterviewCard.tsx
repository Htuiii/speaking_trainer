'use client';

import React, { useState, memo } from 'react';
import { ThemeColors } from '../theme/colors';

interface InterviewCardProps {
  title: string;
  img: string;
  desc: string;
  micIcon: string | { src: string };
  colors: ThemeColors;
}

export const InterviewCard = memo(({ title, img, desc, micIcon, colors }: InterviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const micSrc = typeof micIcon === 'string' ? micIcon : micIcon.src;

  return (
    <div 
      style={{
        ...styles.card,
        boxShadow: isHovered 
          ? '0 30px 40px -10px rgba(0, 0, 0, 0.25), 0 15px 15px -10px rgba(0, 0, 0, 0.15)' 
          : '0 10px 15px -5px rgba(0, 0, 0, 0.15)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img src={img} alt={title} style={styles.image} loading="lazy" />
      </div>
      
      <div style={{ ...styles.contentWrapper, backgroundColor: colors.headerBg }}>
        <div style={styles.whiteSheet}>
          <div style={styles.titleRow}>
            <h3 style={styles.title}>{title}</h3>
            <div style={styles.micContainer}>
              <img src={micSrc} alt="mic" style={styles.micIcon} />
            </div>
          </div>
          <p style={styles.descriptionText}>{desc}</p>
        </div>
      </div>
    </div>
  );
});

InterviewCard.displayName = 'InterviewCard';

const styles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', width: '100%' },
  imageContainer: { position: 'relative', width: '100%', height: '230px', flexShrink: 0 },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  contentWrapper: { marginTop: '-60px', paddingTop: '12px', position: 'relative', zIndex: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' },
  whiteSheet: { backgroundColor: '#F8FAFC', padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: '16px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E293B', lineHeight: '1.2' },
  micContainer: { marginLeft: '15px', flexShrink: 0, width: '40px', display: 'flex', justifyContent: 'center' },
  micIcon: { width: '25px', height: '25px', objectFit: 'contain' },
  descriptionText: { fontSize: '14px', lineHeight: '1.5', color: '#64748B', margin: 0 },
};