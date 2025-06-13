<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    protected $fillable = [
        'name',
        'description',
        'instructions',
        'prep_time',
        'cook_time',
        'servings',
        'difficulty',
        'image_path',
    ];

    protected $casts = [
        'prep_time' => 'integer',
        'cook_time' => 'integer',
        'servings' => 'integer',
    ];

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
            ->withPivot('quantity', 'unit')
            ->withTimestamps();
    }

    public function weeklyPlans(): HasMany
    {
        return $this->hasMany(WeeklyPlan::class);
    }
}
