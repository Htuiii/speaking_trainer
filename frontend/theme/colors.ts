/**
 * Цветовые палитры для светлой и тёмной темы.
 */
type DeepString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, any>
      ? DeepString<T[K]>
      : never;
};
/**
 * Цветовые палитры для светлой и тёмной темы.
 */

export interface ThemeColors {
  headerBg: string;
  sidebarBg: string;
  sidebarActiveBg: string;
  activeText: string;
  titleText: string;
  cardBg: string;
  background: string;
  mutedText: string;
  border: string;
  inputText: string;
  button: string;
  buttonHover: string;
}

const baseColors = {
  primary: '#1D3551',
  secondary: '#467AB6',
};

export const lightTheme: ThemeColors = {
  headerBg: baseColors.primary,    // Темно-синий для шапки
  sidebarBg: '#F8FAFC',           // Светлый фон сайдбара
  sidebarActiveBg: '#E2EAF3',     // Голубоватый фон активного пункта
  activeText: baseColors.secondary, // Цвет "Выберите тему"
  titleText: baseColors.primary,   // Цвет заголовков
  cardBg: '#F1F8FF',
  background: '#E5F2FF',          // Светло-голубой фон основного контента
  mutedText: '#64748B',           // Серый текст описания
  border: '#E2E8F0',              // Цвет разделителей
  inputText: '#1D3551',
  button: '#2C7BD6',          // Цвет кнопок
  buttonHover: '#7EB2EE',   // Цвет кнопок при наведении
};

export const darkTheme: ThemeColors = {
  headerBg: '#0F172A',
  sidebarBg: '#1E293B',
  sidebarActiveBg: '#334155',
  activeText: '#60A5FA',
  titleText: '#F1F5F9',
  cardBg: '#1E293B',
  background: '#0F172A',
  mutedText: '#94A3B8',
  border: '#334155',
  inputText: '#F1F5F9',
  button: '#467AB6',
  buttonHover: '#7EB2EE',
};