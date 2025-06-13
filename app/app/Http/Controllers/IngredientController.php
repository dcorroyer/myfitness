<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index()
    {
        return response()->json(Ingredient::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients',
            'unit' => 'required|string|max:50',
            'category' => 'nullable|string|max:100',
        ]);

        $ingredient = Ingredient::create($validated);
        
        return response()->json($ingredient, 201);
    }

    public function show(Ingredient $ingredient)
    {
        return response()->json($ingredient);
    }

    public function update(Request $request, Ingredient $ingredient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name,' . $ingredient->id,
            'unit' => 'required|string|max:50',
            'category' => 'nullable|string|max:100',
        ]);

        $ingredient->update($validated);
        
        return response()->json($ingredient);
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();
        return response()->json(['message' => 'Ingredient deleted successfully']);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        $ingredients = Ingredient::where('name', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get();
            
        return response()->json($ingredients);
    }
}
