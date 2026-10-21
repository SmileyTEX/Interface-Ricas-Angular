export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  theme: ThemeMode;
  compactView: boolean;
  showPreview: boolean;
  pageSize: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  compactView: false,
  showPreview: true,
  pageSize: 6,
};