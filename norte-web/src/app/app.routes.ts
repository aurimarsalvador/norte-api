import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth.guard';

/**
 * Rotas em portugues porque a URL tambem e interface para o estudante.
 * Tudo carregado sob demanda: a tela de entrar nao deve pagar pelo bundle do catalogo.
 * data.aba marca as telas que mostram a barra de abas e qual aba fica acesa.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Norte',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/onboarding/landing').then((m) => m.Landing),
  },
  {
    path: 'entrar',
    title: 'Entrar | Norte',
    loadComponent: () => import('./features/onboarding/login').then((m) => m.Login),
  },
  {
    path: 'cadastrar',
    title: 'Criar conta | Norte',
    loadComponent: () => import('./features/onboarding/register').then((m) => m.Register),
  },
  {
    path: 'boas-vindas',
    title: 'Boas-vindas | Norte',
    canActivate: [authGuard],
    loadComponent: () => import('./features/onboarding/welcome').then((m) => m.Welcome),
  },
  {
    path: 'questionario',
    title: 'Jornada | Norte',
    canActivate: [authGuard],
    loadComponent: () => import('./features/assessment/assessment').then((m) => m.Assessment),
  },
  {
    path: 'perfil',
    title: 'Meu perfil | Norte',
    data: { aba: 'perfil' },
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'profissoes',
    title: 'Carreiras | Norte',
    data: { aba: 'carreiras' },
    canActivate: [authGuard],
    loadComponent: () => import('./features/catalog/catalog').then((m) => m.Catalog),
  },
  {
    path: 'profissoes/:professionId',
    data: { aba: 'carreiras' },
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/catalog/profession-detail').then((m) => m.ProfessionDetail),
  },
  {
    path: 'microexperiencias/:professionId',
    title: 'Micro-experiência | Norte',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/microexperience/micro-experience').then((m) => m.MicroExperience),
  },
  {
    path: 'meu-caminho',
    title: 'Meu Caminho | Norte',
    data: { aba: 'caminho' },
    canActivate: [authGuard],
    loadComponent: () => import('./features/my-path/my-path').then((m) => m.MyPath),
  },
  { path: '**', redirectTo: '' },
];
