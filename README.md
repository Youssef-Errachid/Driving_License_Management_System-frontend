# DLMS — Driving License Management System (Frontend)

Interface web du système de gestion des permis de conduire (DLMS). Application React (Vite) qui consomme l'API REST du backend Spring Boot pour la gestion des personnes, des demandes, des examens, des permis, des blocages et des utilisateurs.

## Stack technique

- **React 19** + **Vite** — build et dev server
- **React Router v7** — routage et protection par rôle
- **TanStack Query (React Query)** — cache et synchronisation des appels API
- **React Hook Form** + **Yup** — formulaires et validation
- **Axios** — client HTTP (intercepteurs JWT)
- **Tailwind CSS v4** — styles utilitaires
- **Lucide React** — icônes
- **React Toastify** — notifications
- **Cloudinary** — hébergement des photos (titulaire de permis)

## Prérequis

- Node.js 18+ et npm
- Le backend DLMS démarré (API attendue sur `http://localhost:8080/api`, voir `src/api/axios.js`)
- Un compte Cloudinary (pour l'upload de photos)

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine avec :

```
VITE_CLOUDINARY_CLOUD_NAME=<votre_cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<votre_upload_preset>
```

Ces variables sont utilisées par `src/api/services/cloudinaryService.js` pour l'upload direct (unsigned) des photos.

> ⚠️ L'URL de base de l'API (`http://localhost:8080/api`) est actuellement codée en dur dans `src/api/axios.js`. Pour pointer vers un autre environnement, modifier ce fichier.

## Lancer le projet en local

```bash
npm run dev
```

L'application est servie par défaut sur `http://localhost:5173`.

## Scripts disponibles

| Commande          | Description                                  |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Démarre le serveur de développement (HMR)     |
| `npm run build`   | Build de production dans `dist/`              |
| `npm run preview` | Prévisualise le build de production           |
| `npm run lint`    | Lance ESLint sur le projet                    |

## Authentification & rôles

- Connexion via `POST /api/auth/login` (JWT), token stocké dans `localStorage` (`token`, `user`)
- Le token est injecté automatiquement dans chaque requête via l'intercepteur Axios (`src/api/axios.js`)
- Un `401` provoque la purge du token/user côté client
- Deux rôles : **ADMIN** et **AGENT**, chacun avec son propre tableau de bord et ses routes protégées (`RoleGuard`, `ProtectedRoute`, `RoleRedirect`)

## Fonctionnalités principales (côté Agent)

- Gestion des personnes (création, recherche, fiche détaillée)
- Gestion des demandes (nouveau permis, renouvellement, duplicata, déblocage, permis international...)
- Planification et résultats d'examens (vision, théorique, pratique)
- Délivrance de permis
- Blocage de permis (motif, montant de l'amende)
- Gestion des paiements (frais de dossier, examens, service, amendes)
- Consultation des profils conducteurs

## Fonctionnalités principales (côté Admin)

- Tableau de bord global (statistiques, permis bloqués, utilisateurs actifs)
- Gestion des utilisateurs (création, rôles ADMIN/AGENT)
- Configuration des frais des catégories de permis
- Configuration des frais des types d'examens

## Structure du projet

```
src/
├── api/
│   ├── axios.js              # instance Axios + intercepteurs JWT
│   ├── queryClient.js        # config TanStack Query
│   └── services/              # un fichier par ressource API (persons, requests, licenses, license-blocks, exams, payments, drivers, users...)
├── components/                 # composants réutilisables (Layout, StatCard, StatusBadge, RecentRequestsTable, ExamTimeline...)
├── context/                    # AuthContext / AuthProvider / useAuth
├── dashboards/                 # AdminDashboard, AgentDashboard
├── hooks/                       # hooks React Query (useLicenses, useRequests, useExams, useBlockLicense...)
├── pages/                       # pages/formulaires par ressource (LicenseForm, LicenseBlockForm, RequestForm...)
├── routes/                      # AppRouter, ProtectedRoute, RoleGuard, RoleRedirect
├── validation/                  # schémas Yup par formulaire
├── App.jsx
└── main.jsx
```

## Notes

- Interface entièrement en français, conformément au cahier des charges
- Aucun secret ne doit être committé : le fichier `.env` est ignoré par Git
- Ce dépôt ne contient pas encore de configuration Docker pour le frontend — le déploiement conteneurisé décrit dans le cahier des charges concerne actuellement le backend, MySQL et Redis (voir `docker-compose.yml` du backend)
