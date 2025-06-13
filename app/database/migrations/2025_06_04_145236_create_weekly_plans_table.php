<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weekly_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('day_of_week'); // lundi, mardi, mercredi, etc.
            $table->string('meal_type'); // petit-dejeuner, dejeuner, diner
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->integer('servings')->default(1);
            $table->timestamps();

            $table->unique(['user_id', 'day_of_week', 'meal_type'], 'weekly_plan_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weekly_plans');
    }
};
