# Setup MyFood

## Démarrage rapide

1. **Démarrer Docker**
   ```bash
   docker-compose up -d
   ```

2. **Appliquer les migrations et créer les données de test**
   ```bash
   docker compose exec php php artisan migrate:fresh --seed
   ```

3. **Accéder à l'application**
   - Ouvrir http://localhost dans le navigateur
   - Se connecter avec :
     - Email: `demo@myfood.com`
     - Mot de passe: `password`

## Fonctionnalités

- **Planning** : Créer un planning de repas par jour/type de repas (sans gestion de semaines)
- **Recettes** : Gérer ses recettes avec ingrédients
- **Listes de courses** : Génération automatique depuis le planning
- **Authentification** : Données privées par utilisateur

## Données de test incluses

Le seeder crée automatiquement :
- Un utilisateur de démonstration (`demo@myfood.com` / `password`)
- Des ingrédients de base (tomates, oignons, ail, pâtes, etc.)
- Quelques recettes d'exemple (Pâtes à la tomate, Riz au poulet, Bœuf aux légumes)

## Structure de base de données

**Tables principales :**
- `users` - Utilisateurs avec authentification
- `ingredients` - Ingrédients avec unités et catégories
- `recipes` - Recettes avec instructions et difficultés
- `recipe_ingredient` - Table pivot recettes/ingrédients avec quantités
- `weekly_plans` - Planning par utilisateur/jour/repas (sans dates de semaines)
- `shopping_lists` - Listes de courses par utilisateur
- `shopping_list_items` - Items des listes avec quantités

**Tables système :**
- `sessions`, `password_reset_tokens` - Authentification
- `cache`, `jobs`, `failed_jobs` - Système Laravel

## Workflow utilisateur

1. **Créer des recettes** avec leurs ingrédients
2. **Planifier les repas** sur la grille jour/type de repas
3. **Générer une liste de courses** depuis le planning
4. **Réinitialiser le planning** quand on veut recommencer

## Architecture

- **Backend** : Laravel 11 avec authentification
- **Frontend** : React + TypeScript + Inertia.js
- **Base de données** : MySQL via Docker
- **Styling** : Tailwind CSS + Shadcn/ui

## Migrations clean

Les migrations ont été recréées from scratch pour correspondre exactement aux modèles actuels, sans les problèmes de legacy des précédentes versions.