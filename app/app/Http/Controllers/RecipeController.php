<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Ingredient;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    public function index(): Response
    {
        $recipes = Recipe::with('ingredients')->get();
        
        return Inertia::render('Recipes/Index', [
            'recipes' => $recipes
        ]);
    }

    public function create(): Response
    {
        $ingredients = Ingredient::all();
        
        return Inertia::render('Recipes/Create', [
            'ingredients' => $ingredients
        ]);
    }

    public function store(StoreRecipeRequest $request)
    {
        $validated = $request->validated();

        $recipe = Recipe::create($validated);

        foreach ($validated['ingredients'] as $ingredient) {
            $recipe->ingredients()->attach($ingredient['id'], [
                'quantity' => $ingredient['quantity'],
                'unit' => $ingredient['unit']
            ]);
        }

        return redirect()->route('recipes.index');
    }

    public function show(Recipe $recipe): Response
    {
        $recipe->load('ingredients');
        
        return Inertia::render('Recipes/Show', [
            'recipe' => $recipe
        ]);
    }

    public function edit(Recipe $recipe): Response
    {
        $recipe->load('ingredients');
        $ingredients = Ingredient::all();
        
        return Inertia::render('Recipes/Edit', [
            'recipe' => $recipe,
            'ingredients' => $ingredients
        ]);
    }

    public function update(UpdateRecipeRequest $request, Recipe $recipe)
    {
        $validated = $request->validated();

        $recipe->update($validated);
        
        $recipe->ingredients()->detach();
        foreach ($validated['ingredients'] as $ingredient) {
            $recipe->ingredients()->attach($ingredient['id'], [
                'quantity' => $ingredient['quantity'],
                'unit' => $ingredient['unit']
            ]);
        }

        return redirect()->route('recipes.index');
    }

    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return redirect()->route('recipes.index');
    }
}
