<?php

declare(strict_types=1);

use Attributes\ShouldNotRunInsideContainer;
use Castor\Attribute\AsOption;
use Castor\Attribute\AsTask;

use function Castor\import;
use function Castor\context;
use function Castor\io;
use function Castor\fs;
use function database\reset_database;
use function docker\start;

import(__DIR__ . '/src');

#[AsTask(description: 'Install the project')]
#[ShouldNotRunInsideContainer(
    'Could not run this task inside the container. Install need both containers to be accessible.'
)]
function install(#[AsOption(description: 'Do not use cache when building the images')] bool $noCache = false): void
{
    start($noCache);

    composer(['install'])->run();
    
    generate_laravel_keys();
    
    reset_database();

    npm(['install'])->run();
}

#[AsTask(description: 'Clear the cache', aliases: ['cc'])]
function cache_clear(): void
{
    artisan(['cache:clear'])->run();
}

#[AsTask(description: 'Generate Laravel application keys if missing', aliases: ['keys:generate'])]
function generate_laravel_keys(): void
{
    $envFile = context()->workingDirectory . '/.env';
    $appKey = context()->environment['APP_KEY'] ?? null;
    
    io()->section('Checking Laravel application keys...');
    
    // Vérifier si le fichier .env existe
    if (!fs()->exists($envFile)) {
        io()->warning('.env file not found, copying from .env.example');
        if (fs()->exists(context()->workingDirectory . '/.env.example')) {
            fs()->copy(context()->workingDirectory . '/.env.example', $envFile);
        } else {
            io()->error('.env.example not found. Please create a .env file manually.');
            return;
        }
    }
    
    // Vérifier APP_KEY
    if (empty($appKey) || $appKey === 'base64:' || strlen($appKey) < 10) {
        io()->info('APP_KEY is missing or invalid, generating a new one...');
        artisan(['key:generate', '--force'])->run();
        io()->success('✅ APP_KEY generated successfully!');
    } else {
        io()->info('✅ APP_KEY already exists and looks valid');
    }
    
    // Vérifier les permissions sur le fichier .env
    if (fs()->exists($envFile)) {
        $perms = substr(sprintf('%o', fileperms($envFile)), -4);
        if ($perms !== '0600' && $perms !== '0644') {
            io()->info('Setting proper permissions on .env file...');
            chmod($envFile, 0600);
        }
    }
    
    io()->success('Laravel keys verification completed!');
}

#[AsTask(description: 'Run the UI development server')]
function ui_dev(): void
{
    npm(['run', 'dev'])->run();
}
