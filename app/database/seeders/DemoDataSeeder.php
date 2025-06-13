<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Ingredient;
use App\Models\Recipe;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur de test
        User::firstOrCreate(
            ['email' => 'demo@myfood.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password'),
            ]
        );

        // Créer des ingrédients de base
        $ingredients = [
            ['name' => 'Tomates', 'unit' => 'kg', 'category' => 'légumes'],
            ['name' => 'Oignons', 'unit' => 'kg', 'category' => 'légumes'],
            ['name' => 'Ail', 'unit' => 'tête', 'category' => 'légumes'],
            ['name' => 'Pâtes', 'unit' => 'g', 'category' => 'féculents'],
            ['name' => 'Riz', 'unit' => 'g', 'category' => 'féculents'],
            ['name' => 'Poitrine de poulet', 'unit' => 'g', 'category' => 'viandes'],
            ['name' => 'Bœuf haché', 'unit' => 'g', 'category' => 'viandes'],
            ['name' => 'Œufs', 'unit' => 'pièce', 'category' => 'produits frais'],
            ['name' => 'Lait', 'unit' => 'L', 'category' => 'produits frais'],
            ['name' => 'Beurre', 'unit' => 'g', 'category' => 'produits frais'],
            ['name' => 'Huile d\'olive', 'unit' => 'mL', 'category' => 'épices'],
            ['name' => 'Sel', 'unit' => 'g', 'category' => 'épices'],
            ['name' => 'Poivre', 'unit' => 'g', 'category' => 'épices'],
            ['name' => 'Basilic', 'unit' => 'g', 'category' => 'épices'],
            ['name' => 'Carottes', 'unit' => 'kg', 'category' => 'légumes'],
            ['name' => 'Pommes de terre', 'unit' => 'kg', 'category' => 'légumes'],
            ['name' => 'Courgettes', 'unit' => 'kg', 'category' => 'légumes'],
            ['name' => 'Fromage râpé', 'unit' => 'g', 'category' => 'produits frais'],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::firstOrCreate(
                ['name' => $ingredient['name']],
                $ingredient
            );
        }

        // Créer quelques recettes de démonstration
        $tomatePasta = Recipe::firstOrCreate(
            ['name' => 'Pâtes à la tomate'],
            [
                'description' => 'Un classique italien simple et délicieux',
                'instructions' => "1. Faire bouillir les pâtes dans l'eau salée\n2. Faire revenir l'ail et l'oignon dans l'huile d'olive\n3. Ajouter les tomates et laisser mijoter\n4. Mélanger avec les pâtes et servir avec du basilic",
                'prep_time' => 10,
                'cook_time' => 20,
                'servings' => 4,
                'difficulty' => 'easy',
            ]
        );

        // Ajouter les ingrédients aux recettes
        $tomatePasta->ingredients()->sync([
            Ingredient::where('name', 'Pâtes')->first()->id => ['quantity' => 400, 'unit' => 'g'],
            Ingredient::where('name', 'Tomates')->first()->id => ['quantity' => 0.5, 'unit' => 'kg'],
            Ingredient::where('name', 'Oignons')->first()->id => ['quantity' => 0.1, 'unit' => 'kg'],
            Ingredient::where('name', 'Ail')->first()->id => ['quantity' => 1, 'unit' => 'tête'],
            Ingredient::where('name', 'Huile d\'olive')->first()->id => ['quantity' => 30, 'unit' => 'mL'],
            Ingredient::where('name', 'Basilic')->first()->id => ['quantity' => 10, 'unit' => 'g'],
            Ingredient::where('name', 'Sel')->first()->id => ['quantity' => 5, 'unit' => 'g'],
            Ingredient::where('name', 'Poivre')->first()->id => ['quantity' => 2, 'unit' => 'g'],
        ]);

        $chickenRice = Recipe::firstOrCreate(
            ['name' => 'Riz au poulet'],
            [
                'description' => 'Un plat complet et nourrissant',
                'instructions' => "1. Faire cuire le riz\n2. Faire revenir le poulet avec les oignons\n3. Ajouter les légumes\n4. Mélanger avec le riz et assaisonner",
                'prep_time' => 15,
                'cook_time' => 25,
                'servings' => 4,
                'difficulty' => 'medium',
            ]
        );

        $chickenRice->ingredients()->sync([
            Ingredient::where('name', 'Riz')->first()->id => ['quantity' => 300, 'unit' => 'g'],
            Ingredient::where('name', 'Poitrine de poulet')->first()->id => ['quantity' => 500, 'unit' => 'g'],
            Ingredient::where('name', 'Carottes')->first()->id => ['quantity' => 0.2, 'unit' => 'kg'],
            Ingredient::where('name', 'Oignons')->first()->id => ['quantity' => 0.1, 'unit' => 'kg'],
            Ingredient::where('name', 'Huile d\'olive')->first()->id => ['quantity' => 20, 'unit' => 'mL'],
            Ingredient::where('name', 'Sel')->first()->id => ['quantity' => 5, 'unit' => 'g'],
            Ingredient::where('name', 'Poivre')->first()->id => ['quantity' => 2, 'unit' => 'g'],
        ]);

        $beefStew = Recipe::firstOrCreate(
            ['name' => 'Bœuf aux légumes'],
            [
                'description' => 'Un ragoût copieux et réconfortant',
                'instructions' => "1. Faire revenir le bœuf haché\n2. Ajouter les légumes coupés\n3. Laisser mijoter avec les assaisonnements\n4. Servir chaud",
                'prep_time' => 20,
                'cook_time' => 45,
                'servings' => 6,
                'difficulty' => 'medium',
            ]
        );

        $beefStew->ingredients()->sync([
            Ingredient::where('name', 'Bœuf haché')->first()->id => ['quantity' => 600, 'unit' => 'g'],
            Ingredient::where('name', 'Pommes de terre')->first()->id => ['quantity' => 0.5, 'unit' => 'kg'],
            Ingredient::where('name', 'Carottes')->first()->id => ['quantity' => 0.3, 'unit' => 'kg'],
            Ingredient::where('name', 'Oignons')->first()->id => ['quantity' => 0.2, 'unit' => 'kg'],
            Ingredient::where('name', 'Tomates')->first()->id => ['quantity' => 0.3, 'unit' => 'kg'],
            Ingredient::where('name', 'Huile d\'olive')->first()->id => ['quantity' => 30, 'unit' => 'mL'],
            Ingredient::where('name', 'Sel')->first()->id => ['quantity' => 8, 'unit' => 'g'],
            Ingredient::where('name', 'Poivre')->first()->id => ['quantity' => 3, 'unit' => 'g'],
        ]);
    }
}
