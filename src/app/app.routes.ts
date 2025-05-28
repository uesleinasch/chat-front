import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/chat-list',
    pathMatch: 'full'
  },
  {
    path: 'chat-list',
    loadComponent: () => import('./features/chat-list/chat-list.component').then(m => m.ChatListComponent)
  },
  {
    path: 'chat-send',
    loadComponent: () => import('./features/chat-send/chat-send.component').then(m => m.ChatSendComponent)
  },
  {
    path: '**',
    redirectTo: '/chat-list'
  }
];
