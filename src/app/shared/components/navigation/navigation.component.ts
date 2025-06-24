import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar class="sidenav-header">
          <span class="brand-title">Domaine Foncier</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>
          
          <a mat-list-item routerLink="/dossiers" routerLinkActive="active">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Dossiers</span>
          </a>
          
          <a mat-list-item routerLink="/parcelles" routerLinkActive="active">
            <mat-icon matListItemIcon>map</mat-icon>
            <span matListItemTitle>Parcelles</span>
          </a>
          
          <a mat-list-item routerLink="/titres" routerLinkActive="active">
            <mat-icon matListItemIcon>description</mat-icon>
            <span matListItemTitle>Titres</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <a mat-list-item *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active">
            <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
            <span matListItemTitle>Administration</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="main-toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span class="toolbar-title">Circonscription Antananarivo Atsimondrano</span>
          
          <span class="spacer"></span>
          
          <div *ngIf="currentUser$ | async as user" class="user-menu">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <mat-icon>account_circle</mat-icon>
              <span class="user-name">{{ user.name }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>person</mat-icon>
                <span>{{ user.email }}</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Déconnexion</span>
              </button>
            </mat-menu>
          </div>
          
          <div *ngIf="!(currentUser$ | async)" class="auth-buttons">
            <a mat-button routerLink="/auth/login">Connexion</a>
          </div>
        </mat-toolbar>
        
        <div class="content-wrapper">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 500;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-title {
      font-size: 16px;
      font-weight: 400;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .user-name {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .auth-buttons {
      display: flex;
      gap: 8px;
    }

    .content-wrapper {
      padding: 0;
      min-height: calc(100vh - 64px);
    }

    .mat-mdc-list-item.active {
      background-color: rgba(25, 118, 210, 0.1);
      color: #1976d2;
      
      .mat-icon {
        color: #1976d2;
      }
    }

    .mat-mdc-list-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 768px) {
      .user-name {
        display: none;
      }
      
      .toolbar-title {
        font-size: 14px;
      }
    }
  `]
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  currentUser$: Observable<User | null>;
  isAdmin = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout() {
    this.authService.logout();
  }
}