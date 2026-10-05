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
- Le backend DLMS démarré (API attendue sur `http://localhost:8080/api`, voir `src/lib/axios.js`)
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

Ces variables sont utilisées par `src/lib/cloudinaryService.js` pour l'upload direct (unsigned) des photos.

> ⚠️ L'URL de base de l'API (`http://localhost:8080/api`) est actuellement codée en dur dans `src/lib/axios.js`. Pour pointer vers un autre environnement, modifier ce fichier.

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
- Le token est injecté automatiquement dans chaque requête via l'intercepteur Axios (`src/lib/axios.js`)
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

Le code est organisé par fonctionnalité (feature-based) : chaque domaine métier regroupe ses appels API, hooks, composants, pages et schémas de validation.

```
src/
├── app/
│   ├── App.jsx
│   └── router/                 # AppRouter, ProtectedRoute, RoleGuard, RoleRedirect
├── assets/                     # logos et illustrations
├── features/
│   ├── auth/                   # connexion, changement de mot de passe, AuthContext / AuthProvider / useAuth
│   ├── dashboard/              # AdminDashboard, AgentDashboard, StatCard, RecentRequestsTable
│   ├── persons/                # liste, formulaire, fiche détaillée des personnes
│   ├── requests/               # liste, formulaire, détail des demandes
│   ├── exams/                  # examens, ExamTimeline, configuration des types d'examens
│   ├── licenses/               # permis, blocages, catégories de permis
│   ├── drivers/                # profils conducteurs
│   ├── payments/               # paiements
│   └── users/                  # gestion des utilisateurs (Admin)
├── lib/
│   ├── axios.js                # instance Axios + intercepteurs JWT
│   ├── queryClient.js          # config TanStack Query
│   └── cloudinaryService.js    # upload des photos vers Cloudinary
├── shared/
│   ├── components/
│   │   ├── layout/             # Layout, Navbar, Footer
│   │   └── ui/                 # StatusBadge
│   └── pages/                  # AccessDenied, NotFound, ComingSoon
├── styles/                     # index.css, App.css
└── main.jsx
```

Chaque dossier de `features/` suit la même organisation interne (selon les besoins de la fonctionnalité) :

```
features/<feature>/
├── api/          # service d'appel à l'API REST
├── components/   # composants propres à la fonctionnalité
├── context/      # contexte React (auth uniquement)
├── hooks/        # hooks React Query
├── pages/        # pages / formulaires
└── validation/   # schémas Yup
```

## Notes

- Interface entièrement en français, conformément au cahier des charges
- Aucun secret ne doit être committé : le fichier `.env` est ignoré par Git
- Ce dépôt ne contient pas encore de configuration Docker pour le frontend — le déploiement conteneurisé décrit dans le cahier des charges concerne actuellement le backend, MySQL et Redis (voir `docker-compose.yml` du backend)
