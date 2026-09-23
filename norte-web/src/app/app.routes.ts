import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';

/**
 * Rotas em portugues porque a URL tambem e interface para o estudante.
 * Tudo carregado sob demanda: a tela de entrar nao deve pagar pelo bundle do catalogo.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'meu-caminho' },
  {
    path: 'entrar',
    title: 'Entrar | Norte',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'cadastrar',
    title: 'Criar conta | Norte',
    loadComponent: () => import('./features/auth/register').then((m) => m.Register),
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
