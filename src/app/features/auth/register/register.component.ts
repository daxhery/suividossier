import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title class="register-title">
            <mat-icon class="register-icon">person_add</mat-icon>
            Inscription
          </mat-card-title>
          <mat-card-subtitle>
            Créer un nouveau compte
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom complet</mat-label>
              <input matInput formControlName="name" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                Le nom est requis
              </mat-error>
              <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
                Le nom doit contenir au moins 3 caractères
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                L'email est requis
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Format d'email invalide
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Le mot de passe est requis
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Le mot de passe doit contenir au moins 6 caractères
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rôle</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="user">Utilisateur</mat-option>
                <mat-option value="admin">Administrateur</mat-option>
              </mat-select>
              <mat-icon matSuffix>admin_panel_settings</mat-icon>
              <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                Le rôle est requis
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="registerForm.invalid || isLoading" class="register-button">
              <mat-icon *ngIf="isLoading">hourglass_empty</mat-icon>
              <span>{{ isLoading ? 'Inscription...' : 'S\'inscrire' }}</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions align="center">
          <p class="login-link">
            Déjà un compte ? 
            <a routerLink="/auth/login" class="link">Se connecter</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
    }

    .register-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      color: #1976d2;
    }

    .register-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .full-width {
      width: 100%;
    }

    .register-button {
      height: 48px;
      font-size: 16px;
      margin-top: 16px;
    }

    .login-link {
      text-align: center;
      margin: 16px 0 0 0;
      color: #666;
    }

    .link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .register-container {
        padding: 16px;
      }
      
      .register-card {
        margin: 0;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.USER, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const userData: RegisterRequest = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.snackBar.open('Inscription réussie !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Erreur lors de l\'inscription.',
            'Fermer',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}