'use client';

import React from 'react';
import { InterviewCard } from '../components/InterviewCard';
import { SearchSection } from '../components/SearchSection';
import { ThemeColors } from '../theme/colors';

interface TopicsScreenProps {
  filteredTopics: any[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onCardClick: (title: string) => void;
  colors: ThemeColors;
  isMobile: boolean;
  columns: number;
  s: any; 
}

export const TopicsScreen: React.FC<TopicsScreenProps> = ({
  filteredTopics, searchQuery, onSearchChange, onCardClick, colors, isMobile, columns, s
}) => {
  return (
    <>
      <div style={s.topContent}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={s.h1}>
            ЕГЭ; <span style={{ whiteSpace: 'nowrap' }}>Задание 3.</span> Interview
          </h1>
          <p style={s.subtitle}>Выберите тему</p>
        </div>
        
        <SearchSection 
          colors={colors} 
          isMobile={isMobile} 
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      <section style={s.whiteSheet}>
        {/* Сетка с фиксированным количеством колонок для одинакового размера */}
        <div style={{
          ...s.cardGrid,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          alignItems: 'stretch' // Растягивает карточки, чтобы они были одной высоты в ряду
        }}>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((item, index) => (
              <div 
                key={index} 
                onClick={() => onCardClick(item.title)} 
                style={{ cursor: 'pointer', display: 'flex' }}
              >
                <InterviewCard 
                  title={item.title}
                  img={item.img}
                  desc={item.desc}
                  micIcon="/asserts/Microfon.png"
                  colors={colors}
                />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748B' }}>
              Ничего не найдено по вашему запросу
            </div>
          )}
        </div>
      </section>
    </>
  );
};