import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Dossier, Parcelle, Titre } from '../../core/models/dossier.model';

interface DashboardStats {
  totalDossiers: number;
  dossiersEnCours: number;
  dossiersTermines: number;
  dossiersEnAttente: number;
  totalParcelles: number;
  totalTitres: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p class="subtitle">Vue d'ensemble de la gestion des dossiers fonciers</p>
      </div>

      <div class="stats-grid" *ngIf="stats$ | async as stats">
        <mat-card class="stat-card total">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>folder</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalDossiers }}</h3>
                <p>Total Dossiers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card en-cours">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>pending</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.dossiersEnCours }}</h3>
                <p>En cours</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card termine">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.dossiersTermines }}</h3>
                <p>Terminés</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card attente">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.dossiersEnAttente }}</h3>
                <p>En attente</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card parcelles">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>map</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalParcelles }}</h3>
                <p>Parcelles</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card titres">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>description</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalTitres }}</h3>
                <p>Titres</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions-section">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <mat-card class="action-card" routerLink="/dossiers/nouveau">
            <mat-card-content>
              <mat-icon>add_circle</mat-icon>
              <h3>Nouveau Dossier</h3>
              <p>Créer un nouveau dossier foncier</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/parcelles/nouvelle">
            <mat-card-content>
              <mat-icon>add_location</mat-icon>
              <h3>Nouvelle Parcelle</h3>
              <p>Enregistrer une nouvelle parcelle</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/titres/nouveau">
            <mat-card-content>
              <mat-icon>note_add</mat-icon>
              <h3>Nouveau Titre</h3>
              <p>Créer un nouveau titre foncier</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card" routerLink="/dossiers">
            <mat-card-content>
              <mat-icon>search</mat-icon>
              <h3>Rechercher</h3>
              <p>Rechercher dans les dossiers</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="recent-section" *ngIf="recentDossiers$ | async as recentDossiers">
        <h2>Dossiers récents</h2>
        <div class="recent-list">
          <mat-card *ngFor="let dossier of recentDossiers" class="recent-item">
            <mat-card-content>
              <div class="recent-content">
                <div class="recent-info">
                  <h4>{{ dossier.numDossier }}</h4>
                  <p>{{ dossier.requerant?.nom }} {{ dossier.requerant?.prenom }}</p>
                  <small>{{ dossier.dateCreation | date:'dd/MM/yyyy' }}</small>
                </div>
                <div class="recent-status">
                  <span class="status-badge" [ngClass]="getStatusClass(dossier.statust)">
                    {{ dossier.statust }}
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .dashboard-header h1 {
      color: #1976d2;
      margin-bottom: 8px;
      font-size: 32px;
      font-weight: 300;
    }

    .subtitle {
      color: #666;
      font-size: 16px;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 48px;
    }

    .stat-card {
      cursor: default;
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .stat-info h3 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }

    .stat-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .stat-card.total .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.en-cours .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-card.termine .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-card.attente .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-card.parcelles .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .stat-card.titres .stat-icon { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }

    .actions-section {
      margin-bottom: 48px;
    }

    .actions-section h2 {
      color: #333;
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 400;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      text-align: center;
      padding: 16px;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .action-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .action-card h3 {
      color: #333;
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .action-card p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .recent-section h2 {
      color: #333;
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 400;
    }

    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .recent-item {
      transition: transform 0.2s ease-in-out;
    }

    .recent-item:hover {
      transform: translateX(8px);
    }

    .recent-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .recent-info h4 {
      margin: 0 0 4px 0;
      color: #1976d2;
      font-size: 16px;
    }

    .recent-info p {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 14px;
    }

    .recent-info small {
      color: #666;
      font-size: 12px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.en-attente {
      background-color: #ff9800;
      color: white;
    }

    .status-badge.en-cours {
      background-color: #2196f3;
      color: white;
    }

    .status-badge.termine {
      background-color: #4caf50;
      color: white;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .recent-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<DashboardStats>;
  recentDossiers$!: Observable<Dossier[]>;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.stats$ = forkJoin({
      dossiers: this.apiService.getDossiers(),
      parcelles: this.apiService.getParcelles(),
      titres: this.apiService.getTitres()
    }).pipe(
      map(({ dossiers, parcelles, titres }) => {
        const stats: DashboardStats = {
          totalDossiers: dossiers.length,
          dossiersEnCours: dossiers.filter(d => d.statust.toLowerCase().includes('cours')).length,
          dossiersTermines: dossiers.filter(d => d.statust.toLowerCase().includes('terminé')).length,
          dossiersEnAttente: dossiers.filter(d => d.statust.toLowerCase().includes('attente')).length,
          totalParcelles: parcelles.length,
          totalTitres: titres.length
        };
        return stats;
      })
    );

    this.recentDossiers$ = this.apiService.getDossiers().pipe(
      map(dossiers => 
        dossiers
          .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
          .slice(0, 5)
      )
    );
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('terminé')) return 'termine';
    if (statusLower.includes('cours')) return 'en-cours';
    if (statusLower.includes('attente')) return 'en-attente';
    return 'en-attente';
  }
}