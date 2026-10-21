import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS, ThemeMode } from '../models/settings.model';
import { StorageService } from './storage.service';

const KEY = 'tex.settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(StorageService);

  private readonly state = signal<AppSettings>({
    ...DEFAULT_SETTINGS,
    ...this.storage.read<Partial<AppSettings>>(KEY, {}),
    ...this.themeFromUrl(),
  });

  /** Permite pré-visualizar um tema via ?theme=dark na URL. */
  private themeFromUrl(): Partial<AppSettings> {
    const theme = new URLSearchParams(window.location.search).get('theme');
    return theme === 'dark' || theme === 'light' ? { theme } : {};
  }

  readonly settings = this.state.asReadonly();
  readonly theme = computed(() => this.state().theme);
  readonly compactView = computed(() => this.state().compactView);
  readonly showPreview = computed(() => this.state().showPreview);
  readonly pageSize = computed(() => this.state().pageSize);

  constructor() {
    effect(() => {
      const value = this.state();
      this.storage.write(KEY, value);
      this.applyTheme(value.theme);
    });
  }

  setTheme(theme: ThemeMode): void {
    this.state.update((s) => ({ ...s, theme }));
  }

  toggleTheme(): void {
    this.state.update((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
  }

  setCompactView(value: boolean): void {
    this.state.update((s) => ({ ...s, compactView: value }));
  }

  setShowPreview(value: boolean): void {
    this.state.update((s) => ({ ...s, showPreview: value }));
  }

  setPageSize(value: number): void {
    this.state.update((s) => ({ ...s, pageSize: Math.max(3, Math.min(12, value)) }));
  }

  reset(): void {
    this.state.set({ ...DEFAULT_SETTINGS });
  }

  private applyTheme(theme: ThemeMode): void {
    document.documentElement.dataset['theme'] = theme;
  }
}