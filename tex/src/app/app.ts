import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SettingsService } from './core/services/settings.service';
import { ToastContainerComponent } from './shared/ui/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly settings = inject(SettingsService);
  protected readonly menuOpen = signal(false);

  protected readonly year = new Date().getFullYear();
  protected readonly themeLabel = computed(() =>
    this.settings.theme() === 'light' ? 'Tema claro' : 'Tema escuro',
  );

  protected toggleTheme(): void {
    this.settings.toggleTheme();
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}