<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use App\Http\Requests\StoreShoppingListRequest;
use App\Http\Requests\AddShoppingListItemRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ShoppingListController extends Controller
{
    public function index(): Response
    {
        $shoppingLists = ShoppingList::with('items.ingredient')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('ShoppingList/Index', [
            'shoppingLists' => $shoppingLists
        ]);
    }

    public function store(StoreShoppingListRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $shoppingList = ShoppingList::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'] ?: 'Liste de courses',
        ]);

        foreach ($validated['items'] as $item) {
            $shoppingList->items()->create([
                'ingredient_id' => $item['ingredient_id'],
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'unit' => $item['unit'],
                'is_manual' => $item['is_manual'] ?? false,
            ]);
        }

        return redirect()->route('shopping-lists.show', $shoppingList);
    }

    public function show(ShoppingList $shoppingList): Response
    {
        $shoppingList->load('items.ingredient');

        return Inertia::render('ShoppingList/Show', [
            'shoppingList' => $shoppingList
        ]);
    }

    public function create(Request $request): Response
    {
        // Check for ingredients from session (from weekly plan generation)
        $ingredients = session('pending_shopping_list', []);
        
        // Clear the session data after retrieving it
        session()->forget('pending_shopping_list');

        return Inertia::render('ShoppingList/Create', [
            'initialIngredients' => $ingredients
        ]);
    }

    public function addItem(AddShoppingListItemRequest $request, ShoppingList $shoppingList): RedirectResponse
    {
        $validated = $request->validated();

        $shoppingList->items()->create([
            'ingredient_id' => $validated['ingredient_id'],
            'name' => $validated['name'],
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'is_manual' => $validated['is_manual'] ?? true,
        ]);

        return back();
    }

    public function removeItem(ShoppingListItem $item): RedirectResponse
    {
        $item->delete();
        return back();
    }

    public function toggleItem(ShoppingListItem $item): RedirectResponse
    {
        $item->update(['is_checked' => !$item->is_checked]);
        return back();
    }

    public function complete(ShoppingList $shoppingList): RedirectResponse
    {
        $shoppingList->update(['is_completed' => true]);
        return back();
    }

    public function destroy(ShoppingList $shoppingList): RedirectResponse
    {
        $shoppingList->delete();
        return redirect()->route('shopping-lists.index');
    }
}
