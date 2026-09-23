import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth.guard';

/** Telas da jornada de entrada: tem barra propria, entao dispensam o cabecalho do app. */
const SEM_CASCA = { casca: false };

/**
 * Rotas em portugues porque a URL tambem e interface para o estudante.
 * Tudo carregado sob demanda: a tela de entrar nao deve pagar pelo bundle do catalogo.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Norte',
    data: SEM_CASCA,
    canActivate: [guestGuard],
    loadComponent: () => import('./features/onboarding/landing').then((m) => m.Landing),
  },
  {
    path: 'entrar',
    title: 'Entrar | Norte',
    data: SEM_CASCA,
    loadComponent: () => import('./features/onboarding/login').then((m) => m.Login),
  },
  {
    path: 'cadastrar',
    title: 'Criar conta | Norte',
    data: SEM_CASCA,
    loadComponent: () => import('./features/onboarding/register').then((m) => m.Register),
  },
  {
    path: 'boas-vindas',
    title: 'Boas-vindas | Norte',
    data: SEM_CASCA,
    canActivate: [authGuard],
    loadComponent: () => import('./features/onboarding/welcome').then((m) => m.Welcome),
  },
  {
    path: 'questionario',
    title: 'Questionario | Norte',
    canActivate: [authGuard],
    loadComponent: () => import('./features/assessment/assessment').then((m) => m.Assessment),
  },
  {
    path: 'perfil',
    title: 'Meu perfil | Norte',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'profissoes',
    title: 'Explorar profissoes | Norte',
    canActivate: [authGuard],
    loadComponent: () => import('./features/catalog/catalog').then((m) => m.Catalog),
  },
  {
    path: 'profissoes/:professionId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/catalog/profession-detail').then((m) => m.ProfessionDetail),
  },
  {
    path: 'microexperiencias/:professionId',
    title: 'Microexperiencia | Norte',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/microexperience/micro-experience').then((m) => m.MicroExperience),
  },
  {
    path: 'meu-caminho',
    title: 'Meu Caminho | Norte',
    canActivate: [authGuard],
    loadComponent: () => import('./features/my-path/my-path').then((m) => m.MyPath),
  },
  { path: '**', redirectTo: '' },
];
