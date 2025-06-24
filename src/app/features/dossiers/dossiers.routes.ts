import { Routes } from '@angular/router';

export const dossiersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dossiers-list/dossiers-list.component').then(m => m.DossiersListComponent)
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./dossier-form/dossier-form.component').then(m => m.DossierFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./dossier-detail/dossier-detail.component').then(m => m.DossierDetailComponent)
  },
  {
    path: ':id/modifier',
    loadComponent: () => import('./dossier-form/dossier-form.component').then(m => m.DossierFormComponent)
  }
];