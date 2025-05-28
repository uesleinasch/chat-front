import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/chat',
    pathMatch: 'full'
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat-list/chat-list.component').then(m => m.ChatListComponent)
  },
  {
    path: '**',
    redirectTo: '/chat'
  }
];
