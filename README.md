# Domaine - Frontend

Application web de gestion de dossiers fonciers et d'administration (partie frontend uniquement), développée avec Angular.

## Fonctionnalités principales
- Authentification JWT (connexion, rôles admin/user)
- Menu latéral responsive unique pour tous les utilisateurs
- Recherche et gestion des dossiers (suivie) par numéro de titre ou parcelle
- Gestion des utilisateurs (admin)
- Interface responsive/mobile (tableaux, formulaires, navigation)
- Tableaux dynamiques avec adaptation automatique des colonnes selon la taille d'écran

## Installation

1. **Cloner le dépôt (frontend uniquement)**
   ```bash
   git clone <url-du-repo>
   cd frontend
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```

## Lancement du projet

```bash
ng serve
```
L'application sera accessible sur [http://localhost:4200](http://localhost:4200)

## Structure des dossiers principaux

- `src/app/auth/` : gestion de l'authentification (service, interceptor, etc.)
- `src/app/shared/components/nav-menu/` : composant de menu latéral unique (admin & user)
- `src/app/suivie/` : recherche et gestion des dossiers
- `src/app/admin/` : pages d'administration (utilisateurs, dashboard...)

## Responsive & Mobile
- Le menu latéral se replie automatiquement en mobile
- Les tableaux affichent moins de colonnes sur petit écran
- Les formulaires et boutons sont adaptés au tactile

## Conseils
- Pour toute modification du menu, n'éditer que le composant `nav-menu`
- Les rôles sont gérés côté frontend (et doivent être synchronisés avec le backend si utilisé)

## Contact
Pour toute question ou contribution concernant le frontend, contactez l'équipe randriantsoamanitramichael1@gmail.com.
