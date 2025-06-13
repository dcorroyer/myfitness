<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingListItem extends Model
{
    protected $fillable = [
        'shopping_list_id',
        'ingredient_id',
        'name',
        'quantity',
        'unit',
        'is_checked',
        'is_manual',
        'recipe_details',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'is_checked' => 'boolean',
        'is_manual' => 'boolean',
        'recipe_details' => 'array',
    ];

    public function shoppingList(): BelongsTo
    {
        return $this->belongsTo(ShoppingList::class);
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
