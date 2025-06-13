<?php

namespace App\Http\Controllers;

use App\Models\WeeklyPlan;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class WeeklyPlanController extends Controller
{
    public function index(): Response
    {
        $plans = WeeklyPlan::with('recipe')
            ->where('user_id', auth()->id())
            ->get();

        $recipes = Recipe::all();

        return Inertia::render('WeeklyPlan/Index', [
            'plans' => $plans,
            'recipes' => $recipes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|string',
            'meal_type' => 'required|string',
            'recipe_id' => 'required|exists:recipes,id',
            'servings' => 'required|integer|min:1',
        ]);

        WeeklyPlan::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'day_of_week' => $validated['day_of_week'],
                'meal_type' => $validated['meal_type'],
            ],
            [
                'recipe_id' => $validated['recipe_id'],
                'servings' => $validated['servings'],
            ]
        );

        return back();
    }

    public function destroy(WeeklyPlan $weeklyPlan): RedirectResponse
    {
        $weeklyPlan->delete();
        return back();
    }

    public function generateShoppingList()
    {
        $userId = auth()->id();
        $plans = WeeklyPlan::with('recipe.ingredients')
            ->where('user_id', $userId)
            ->get();

        if ($plans->isEmpty()) {
            return back()->with('error', 'Aucun repas planifié trouvé');
        }

        $ingredientsList = [];

        foreach ($plans as $plan) {
            if (!$plan->recipe || !$plan->recipe->ingredients) {
                continue;
            }
            
            foreach ($plan->recipe->ingredients as $ingredient) {
                $quantity = $ingredient->pivot->quantity * $plan->servings;
                $unit = $ingredient->pivot->unit ?: $ingredient->unit;

                $key = $ingredient->id . '_' . $unit;

                $recipeDetail = [
                    'recipe_id' => $plan->recipe->id,
                    'recipe_name' => $plan->recipe->name,
                    'day_of_week' => $plan->day_of_week,
                    'meal_type' => $plan->meal_type,
                    'servings' => $plan->servings,
                    'quantity' => $quantity,
                    'original_quantity' => $ingredient->pivot->quantity,
                ];

                if (isset($ingredientsList[$key])) {
                    $ingredientsList[$key]['quantity'] += $quantity;
                    $ingredientsList[$key]['recipe_details'][] = $recipeDetail;
                } else {
                    $ingredientsList[$key] = [
                        'ingredient_id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'quantity' => $quantity,
                        'unit' => $unit,
                        'is_manual' => false,
                        'recipe_details' => [$recipeDetail],
                    ];
                }
            }
        }

        // Store ingredients in session and redirect to create page
        session(['pending_shopping_list' => array_values($ingredientsList)]);
        
        return redirect()->route('shopping-lists.create');
    }

    public function reset(): RedirectResponse
    {
        WeeklyPlan::reset(auth()->id());
        return back();
    }
}
