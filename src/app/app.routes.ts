import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dossiers',
    loadChildren: () => import('./features/dossiers/dossiers.routes').then(m => m.dossiersRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'parcelles',
    loadChildren: () => import('./features/parcelles/parcelles.routes').then(m => m.parcellesRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'titres',
    loadChildren: () => import('./features/titres/titres.routes').then(m => m.titresRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];