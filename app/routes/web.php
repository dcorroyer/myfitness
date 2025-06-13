<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\WeeklyPlanController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\IngredientController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('recipes', RecipeController::class);
    Route::get('/ingredients/search', [IngredientController::class, 'search'])->name('ingredients.search');
    Route::resource('ingredients', IngredientController::class);

    Route::get('/planning', [WeeklyPlanController::class, 'index'])->name('planning.index');
    Route::post('/planning', [WeeklyPlanController::class, 'store'])->name('planning.store');
    Route::delete('/planning/{weeklyPlan}', [WeeklyPlanController::class, 'destroy'])->name('planning.destroy');
    Route::post('/planning/generate-shopping-list', [WeeklyPlanController::class, 'generateShoppingList'])->name('planning.generate-shopping-list');
    Route::post('/planning/reset', [WeeklyPlanController::class, 'reset'])->name('planning.reset');

    Route::get('/shopping-lists', [ShoppingListController::class, 'index'])->name('shopping-lists.index');
    Route::get('/shopping-lists/create', [ShoppingListController::class, 'create'])->name('shopping-lists.create');
    Route::post('/shopping-lists', [ShoppingListController::class, 'store'])->name('shopping-lists.store');
    Route::get('/shopping-lists/{shoppingList}', [ShoppingListController::class, 'show'])->name('shopping-lists.show');
    Route::post('/shopping-lists/{shoppingList}/items', [ShoppingListController::class, 'addItem'])->name('shopping-lists.add-item');
    Route::delete('/shopping-lists/items/{item}', [ShoppingListController::class, 'removeItem'])->name('shopping-lists.remove-item');
    Route::patch('/shopping-lists/items/{item}/toggle', [ShoppingListController::class, 'toggleItem'])->name('shopping-lists.toggle-item');
    Route::patch('/shopping-lists/{shoppingList}/complete', [ShoppingListController::class, 'complete'])->name('shopping-lists.complete');
    Route::delete('/shopping-lists/{shoppingList}', [ShoppingListController::class, 'destroy'])->name('shopping-lists.destroy');
});

require __DIR__.'/auth.php';
