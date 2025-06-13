<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyPlan extends Model
{
    protected $fillable = [
        'user_id',
        'day_of_week',
        'meal_type',
        'recipe_id',
        'servings',
    ];

    protected $casts = [
        'servings' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public static function reset(int $userId): void
    {
        static::where('user_id', $userId)->delete();
    }
}
