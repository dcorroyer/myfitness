<?php

declare(strict_types=1);

namespace database;

use Castor\Attribute\AsTask;

use function Castor\context;
use function Castor\io;



#[AsTask(name: 'database:reset', description: 'Reset the database', aliases: ['db:reset'])]
function reset_database(bool $force = false): void
{
    $databaseName = context()->environment['DB_DATABASE'] ?? null;
    if ($databaseName === null) {
        io()->error('DB_DATABASE is not set in the environment.');

        return;
    }

    // Vérifier si la base de données existe (Laravel n'a pas de commande directe pour ça)
    try {
        $output = artisan(['tinker', '--execute=DB::connection()->getPdo();'])
            ->run(context()->withQuiet())
            ->getOutput();
        
        io()->info('Database connection successful.');

        if (!$force && io()->confirm('Do you want to reset the database (wipe all tables and recreate)?') === false) {
            return;
        }
    } catch (\Exception $e) {
        io()->warning('Database connection failed, will attempt to create tables.');
    }

    // Reset complet avec Laravel
    wipe_database();
    migrate();
    load_seeders();
}

#[AsTask(description: 'Create the database', aliases: ['db:create'])]
function create_database(): void
{
    io()->warning('Laravel assumes the database already exists. Please create it manually or use migration commands.');
    io()->info('You can run: php artisan migrate:install to create migration table.');
    artisan(['migrate:install'])->run();
}

#[AsTask(description: 'Drop the database', aliases: ['db:drop'])]
function drop_database(): void
{
    io()->warning('Laravel does not have a direct database drop command.');
    io()->info('Using db:wipe to remove all tables instead.');
    wipe_database();
}

#[AsTask(description: 'Wipe all tables from database', aliases: ['db:wipe'])]
function wipe_database(): void
{
    artisan(['db:wipe', '--force'])->run();
}

#[AsTask(description: 'Create the schema', aliases: ['db:schema:create'])]
function create_schema(): void
{
    io()->info('Running migrations to create schema...');
    artisan(['migrate', '--force'])->run();
}

#[AsTask(description: 'Drop the schema', aliases: ['db:schema:drop'])]
function drop_schema(): void
{
    io()->info('Wiping all tables (Laravel equivalent of schema drop)...');
    artisan(['db:wipe', '--force'])->run();
}

#[AsTask(description: 'Migrate the database', aliases: ['db:migrate'])]
function migrate(): void
{
    artisan(['migrate', '--force'])->run();
}

#[AsTask(description: 'Fresh migration (drop all tables and re-migrate)', aliases: ['db:fresh'])]
function migrate_fresh(): void
{
    artisan(['migrate:fresh', '--force'])->run();
}

#[AsTask(description: 'Fresh migration with seeders', aliases: ['db:fresh:seed'])]
function migrate_fresh_with_seed(): void
{
    artisan(['migrate:fresh', '--seed', '--force'])->run();
}

#[AsTask(description: 'Rollback migrations', aliases: ['db:rollback'])]
function migrate_rollback(int $step = 1): void
{
    artisan(['migrate:rollback', "--step={$step}", '--force'])->run();
}

#[AsTask(description: 'Load the seeders', aliases: ['db:seed'])]
function load_seeders(string $class = null): void
{
    // Vérifier si des seeders existent
    $seedersPath = context()->workingDirectory . '/database/seeders';
    if (!is_dir($seedersPath)) {
        io()->warning('Seeders directory does not exist. Please create seeders first.');
        io()->info('You can create a seeder with: php artisan make:seeder YourSeeder');
        return;
    }

    $command = ['db:seed', '--force'];
    
    if ($class !== null) {
        $command[] = "--class={$class}";
    }
    
    artisan($command)->run();
}

#[AsTask(description: 'Load the fixtures (legacy name for seeders)', aliases: ['db:fixtures:load'])]
function load_fixtures(): void
{
    io()->info('Loading seeders (Laravel equivalent of fixtures)...');
    load_seeders();
}
