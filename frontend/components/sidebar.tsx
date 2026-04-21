'use client';

import React from 'react';
import { ThemeColors } from '../theme/colors';

const HomeIcon = "/asserts/Home.png";
const ExerciseIcon = "/asserts/Exercise.png";
const MockExamIcon = "/asserts/MockExam.png";

interface SidebarProps {
  colors: ThemeColors;
  activeTask?: number;
  onSelectTask?: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ colors, activeTask = 3, onSelectTask }) => {
  return (
    <aside style={styles.sidebarContainer}>
      <nav style={styles.navStack}>

        {/* Блок: Главная */}
        <div style={{ ...styles.menuItem, paddingTop: '42px' }}>
          <img src={HomeIcon} alt="" style={styles.icon} />
          <span style={{ ...styles.mainText, color: '#64748B' }}>Главная</span>
        </div>

        <div style={{ ...styles.horizontalDivider, backgroundColor: colors.border }} />

        {/* Блок: По заданиям */}
        <div style={{ ...styles.menuItem, paddingBottom: '12px' }}>
          <img src={ExerciseIcon} alt="" style={styles.icon} />
          <span style={{ ...styles.mainText, color: '#1E293B', fontWeight: '600' }}>По заданиям</span>
        </div>

        {/* Вложенное меню */}
        <div style={styles.subListContainer}>
          <div style={{ ...styles.verticalLine, backgroundColor: colors.border }} />
          {[1, 2, 3, 4].map((id) => {
            const isActive = id === activeTask; // теперь активность определяется пропом
            return (
              <div
                key={id}
                style={styles.subItemWrapper}
                onClick={() => onSelectTask?.(id)}
              >
                <div
                  style={{
                    ...styles.statusDot,
                    backgroundColor: isActive ? '#334155' : colors.border,
                  }}
                />
                <div
                  style={{
                    ...styles.subItemText,
                    backgroundColor: isActive ? colors.sidebarActiveBg : 'transparent',
                    color: isActive ? colors.activeText : '#64748B',
                    fontWeight: isActive ? '600' : '400',
                    width: 'fit-content',
                    paddingRight: '75px',
                  }}
                >
                  Задание {id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Блок: Пробный экзамен */}
        <div style={styles.menuItem}>
          <img src={MockExamIcon} alt="" style={styles.icon} />
          <span style={{ ...styles.mainText, color: '#64748B' }}>Пробный экзамен</span>
        </div>

        <div style={{ ...styles.horizontalDivider, backgroundColor: colors.border }} />
      </nav>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebarContainer: {
    width: '270px',
    backgroundColor: '#F1F8FF',
    borderRight: '1px solid #D3DAE2',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  navStack: { display: 'flex', flexDirection: 'column' },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '40px',
    paddingRight: '24px',
    cursor: 'pointer',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  horizontalDivider: { height: '1px', width: '100%', alignSelf: 'center', margin: '10px 0' },
  icon: { width: '20px', height: '20px', objectFit: 'contain' },
  mainText: { fontSize: '17px' },
  subListContainer: { position: 'relative', marginLeft: '50px', marginTop: '4px', marginBottom: '16px' },
  verticalLine: { position: 'absolute', left: '0', top: '0', bottom: '0', width: '2px' },
  subItemWrapper: { display: 'flex', alignItems: 'center', position: 'relative', margin: '4px 0' },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    position: 'absolute',
    left: '-4px',
    zIndex: 2,
  },
  subItemText: {
    marginLeft: '24px',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '12px',
    fontSize: '16px',
    display: 'block',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
};