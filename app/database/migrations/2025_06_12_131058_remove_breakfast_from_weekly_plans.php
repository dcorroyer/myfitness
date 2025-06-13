<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('weekly_plans')->where('meal_type', 'petit-dejeuner')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback needed - breakfast entries can be re-added manually if needed
    }
};
