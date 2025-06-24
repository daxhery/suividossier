import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { Dossier } from '../../../core/models/dossier.model';

@Component({
  selector: 'app-dossiers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
  ],
  template: `
    <div class="dossiers-container">
      <div class="header">
        <h1>Gestion des Dossiers</h1>
        <button mat-raised-button color="primary" routerLink="/dossiers/nouveau">
          <mat-icon>add</mat-icon>
          Nouveau Dossier
        </button>
      </div>

      <mat-card class="search-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher un dossier</mat-label>
            <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()" 
                   placeholder="Numéro de dossier, nom du requérant...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="filteredDossiers$ | async" class="dossiers-table">
              
              <ng-container matColumnDef="numDossier">
                <th mat-header-cell *matHeaderCellDef>N° Dossier</th>
                <td mat-cell *matCellDef="let dossier">
                  <strong>{{ dossier.numDossier }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="requerant">
                <th mat-header-cell *matHeaderCellDef>Requérant</th>
                <td mat-cell *matCellDef="let dossier">
                  <div class="requerant-info">
                    <div class="name">{{ dossier.requerant?.nom }} {{ dossier.requerant?.prenom }}</div>
                    <div class="contact">{{ dossier.requerant?.numTelephone }}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="statust">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let dossier">
                  <mat-chip [ngClass]="getStatusClass(dossier.statust)">
                    {{ dossier.statust }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="numPV">
                <th mat-header-cell *matHeaderCellDef class="hide-mobile">N° PV</th>
                <td mat-cell *matCellDef="let dossier" class="hide-mobile">
                  {{ dossier.numPV || '-' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="dateCreation">
                <th mat-header-cell *matHeaderCellDef class="hide-mobile">Date création</th>
                <td mat-cell *matCellDef="let dossier" class="hide-mobile">
                  {{ dossier.dateCreation | date:'dd/MM/yyyy' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="operations">
                <th mat-header-cell *matHeaderCellDef class="hide-mobile">Opérations</th>
                <td mat-cell *matCellDef="let dossier" class="hide-mobile">
                  <span class="operations-count">{{ dossier.operations?.length || 0 }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="observations">
                <th mat-header-cell *matHeaderCellDef class="hide-mobile">Observations</th>
                <td mat-cell *matCellDef="let dossier" class="hide-mobile">
                  <div class="observations-info">
                    <span class="total">{{ dossier.observations?.length || 0 }}</span>
                    <span class="satisfied">({{ getSatisfiedObservations(dossier) }} satisfaites)</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let dossier">
                  <div class="actions">
                    <button mat-icon-button [routerLink]="['/dossiers', dossier.id]" 
                            matTooltip="Voir détails">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button [routerLink]="['/dossiers', dossier.id, 'modifier']" 
                            matTooltip="Modifier">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="dossier-row" [routerLink]="['/dossiers', row.id]"></tr>
            </table>
          </div>

          <div *ngIf="(filteredDossiers$ | async)?.length === 0" class="no-data">
            <mat-icon>folder_open</mat-icon>
            <h3>Aucun dossier trouvé</h3>
            <p>{{ searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par créer un nouveau dossier' }}</p>
            <button mat-raised-button color="primary" routerLink="/dossiers/nouveau">
              <mat-icon>add</mat-icon>
              Créer un dossier
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dossiers-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      color: #1976d2;
      margin: 0;
      font-size: 28px;
      font-weight: 400;
    }

    .search-card {
      margin-bottom: 24px;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .table-card {
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .dossiers-table {
      width: 100%;
      min-width: 800px;
    }

    .dossier-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .dossier-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .requerant-info .name {
      font-weight: 500;
      color: #333;
    }

    .requerant-info .contact {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .operations-count {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .observations-info .total {
      font-weight: 500;
      color: #333;
    }

    .observations-info .satisfied {
      font-size: 12px;
      color: #4caf50;
      margin-left: 4px;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .no-data {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-data h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .no-data p {
      margin: 0 0 24px 0;
    }

    /* Status chips */
    mat-chip.en-attente {
      background-color: #ff9800;
      color: white;
    }

    mat-chip.en-cours {
      background-color: #2196f3;
      color: white;
    }

    mat-chip.termine {
      background-color: #4caf50;
      color: white;
    }

    mat-chip.rejete {
      background-color: #f44336;
      color: white;
    }

    @media (max-width: 768px) {
      .dossiers-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header h1 {
        text-align: center;
      }

      .hide-mobile {
        display: none !important;
      }

      .dossiers-table {
        min-width: 600px;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class DossiersListComponent implements OnInit {
  dossiers$!: Observable<Dossier[]>;
  filteredDossiers$!: Observable<Dossier[]>;
  searchTerm = '';

  displayedColumns: string[] = [
    'numDossier', 
    'requerant', 
    'statust', 
    'numPV', 
    'dateCreation', 
    'operations', 
    'observations', 
    'actions'
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDossiers();
  }

  private loadDossiers() {
    this.dossiers$ = this.apiService.getDossiers();
    this.filteredDossiers$ = this.dossiers$;
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredDossiers$ = this.dossiers$;
      return;
    }

    this.filteredDossiers$ = this.dossiers$.pipe(
      map(dossiers => 
        dossiers.filter(dossier => 
          dossier.numDossier.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          dossier.requerant?.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          dossier.requerant?.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          dossier.statust.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (dossier.numPV && dossier.numPV.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      )
    );
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('terminé')) return 'termine';
    if (statusLower.includes('cours')) return 'en-cours';
    if (statusLower.includes('rejeté')) return 'rejete';
    return 'en-attente';
  }

  getSatisfiedObservations(dossier: Dossier): number {
    return dossier.observations?.filter(obs => obs.status === 1).length || 0;
  }
}