'use client';

import React from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { ThemeColors } from '../theme/colors';

interface InterviewLayoutProps {
  children: React.ReactNode;
  colors: ThemeColors;
  isSidebarOpen: boolean;
  isSmallScreen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onSelectTask?: (id: number) => void;
}

export const InterviewLayout: React.FC<InterviewLayoutProps> = ({
  children,
  colors,
  isSidebarOpen,
  isSmallScreen,
  setIsSidebarOpen,
  onSelectTask
}) => {
  return (
    <div style={layoutStyles.pageWrapper}>
      <Header colors={colors} />
      
      <div style={layoutStyles.contentRow}>
        <div style={{
          ...layoutStyles.sidebarContainer,
          display: (isSmallScreen && !isSidebarOpen) ? 'none' : 'block',
          position: isSmallScreen ? 'fixed' : 'relative',
        }}>
          <Sidebar colors={colors} onSelectTask={onSelectTask} />
        </div>

        {isSmallScreen && isSidebarOpen && (
          <div 
            style={layoutStyles.overlay} 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        <main style={layoutStyles.mainArea}>
           <div style={layoutStyles.whiteSheet}>
              {children}
           </div>
        </main>
      </div>
    </div>
  );
};

const layoutStyles: Record<string, React.CSSProperties> = {
  pageWrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh',
    overflow: 'hidden', 
    backgroundColor: '#EAF5FF' 
  },
  contentRow: { 
    display: 'flex', 
    flex: 1, 
    overflow: 'hidden', 
    position: 'relative' 
  },
  sidebarContainer: { 
    height: '100%', 
    zIndex: 1001,
    backgroundColor: '#F8FAFC'
  },
  mainArea: { 
    flex: 1, 
    padding: '25px 40px', 
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  whiteSheet: { 
    backgroundColor: '#FFF', 
    borderRadius: '24px', 
    padding: '40px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'fit-content'
  },
  overlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    zIndex: 1000 
  },
};