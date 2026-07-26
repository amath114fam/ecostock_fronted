# Eco-Stock — Frontend

Application de gestion de stock permettant de gérer des **entrepôts** et des **produits** depuis un tableau de bord. Ce dépôt contient uniquement le frontend, développé avec **Vue 3** et **Vite**.

## Fonctionnalités

- Authentification (connexion / déconnexion) via token JWT
- Tableau de bord avec vue d'ensemble du stock
- Gestion des entrepôts (création, consultation, modification, suppression)
- Gestion des produits (création, consultation, modification, déplacement, suppression)
- Recherche d'entrepôts et de produits
- Graphiques (via Chart.js)

## Prérequis

- **Node.js** version `22.18.0` ou supérieure (ou `24.12.0`+)
- **npm** (installé avec Node.js)
- Une **API backend** disponible (voir section Configuration ci-dessous)

## Installation

1. Cloner ou extraire le projet, puis se placer dans le dossier :
```bash
   cd frontStock
```

2. Installer les dépendances :
```bash
   npm install
```

## Configuration

L'application communique avec une API backend dont l'adresse est définie dans :

src/services/config.js


Par défaut :
```js
export const API_URL = 'http://localhost:8000/api'
```

Si votre backend tourne sur une autre adresse ou un autre port, modifiez cette valeur en conséquence avant de lancer l'application.

## Lancer le projet en développement

```bash
npm run dev
```

L'application sera accessible sur l'URL affichée dans le terminal (généralement `http://localhost:5173`).

## Construire pour la production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## Prévisualiser le build de production

```bash
npm run preview
```

## Structure du projet

frontStock/
├── public/ # Fichiers statiques (favicon, etc.)
├── src/
│ ├── assets/ # Styles globaux (main.css)
│ ├── components/ # Composants Vue (formulaires, listes, sidebar, modales...)
│ │ └── icons/ # Icônes SVG en composants Vue
│ ├── services/ # Appels à l'API (authentification, produits, entrepôts)
│ ├── App.vue # Composant racine de l'application
│ └── main.js # Point d'entrée de l'application
├── index.html
├── package.json
└── vite.config.js


## Technologies utilisées

- [Vue 3](https://vuejs.org/) — framework JavaScript
- [Vite](https://vitejs.dev/) — outil de build et serveur de développement
- [Chart.js](https://www.chartjs.org/) / [vue-chartjs](https://vue-chartjs.org/) — graphiques

## Notes

- L'authentification stocke les tokens (`access_token`, `refresh_token`) dans le `localStorage` du navigateur.
- Ce projet nécessite que l'API backend soit lancée en parallèle pour fonctionner correctement (authentification, récupération et gestion des données).