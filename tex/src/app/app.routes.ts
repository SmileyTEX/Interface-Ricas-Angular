import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Tex — Painel',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'notas',
    title: 'Tex — Minhas notas',
    loadComponent: () => import('./features/notes/notes.component').then((m) => m.NotesComponent),
  },
  {
    path: 'preferencias',
    title: 'Tex — Preferências',
    loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  { path: '**', redirectTo: '' },
];