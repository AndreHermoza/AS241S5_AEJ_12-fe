import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'text-to-image',
    loadComponent: () => import(
    '../app/features/text-to-image.component/text-to-image.component'
    ).then(m => m.TextToImageComponent),
    title: 'Texto a Imagen'
  },
  {
    path: 'bg-remover',
    loadComponent: () => import(
    '../app/features/bg-remover.component/bg-remover.component'
    ).then(m => m.BgRemoverComponent),
    title: 'Removedor de Fondo'
  },
  { path: '', redirectTo: '/text-to-image', pathMatch: 'full' },
  { path: '**', redirectTo: '/text-to-image' }
];