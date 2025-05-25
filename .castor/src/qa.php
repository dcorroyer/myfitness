<?php

declare(strict_types=1);

namespace qa;

use Castor\Attribute\AsTask;

use function Castor\io;
use function Castor\context;

#[AsTask(description: 'Install Laravel dev dependencies')]
function install(): void
{
    io()->title('Installing Laravel dev dependencies');
    
    composer(['install', '--dev'])->run();
    
    io()->success('Laravel dev dependencies installed successfully!');
}

#[AsTask(description: 'Run all the QA tasks')]
function all(bool $fix = false): void
{
    io()->title('Running all the QA tasks');

    // Lancer les outils QA individuellement pour Laravel
    io()->section('Running Laravel Pint (Code Style)');
    if ($fix) {
        php(['./vendor/bin/pint'])->run();
    } else {
        php(['./vendor/bin/pint', '--test'])->run();
    }

    io()->section('Running PHPStan analysis');
    phpstan();
    
    io()->section('Running the PHPUnit task');
    phpunit();
}

#[AsTask(description: 'Run Laravel Pint (Code Style)', aliases: ['ecs'])]
function pint(bool $fix = false): void
{
    if ($fix) {
        php(['./vendor/bin/pint'])->run();
    } else {
        php(['./vendor/bin/pint', '--test'])->run();
    }
}

#[AsTask(description: 'Run PHPStan static analysis')]
function phpstan(): void
{
    $workingDir = context()->workingDirectory;
    $phpstanConfig = $workingDir . '/phpstan.neon';
    $phpstanConfigDist = $workingDir . '/phpstan.neon.dist';
    
    if (file_exists($phpstanConfig) || file_exists($phpstanConfigDist)) {
        php(['./vendor/bin/phpstan', 'analyse', '--memory-limit=512M'])->run();
    } else {
        io()->warning('PHPStan not configured.');
        io()->info('Install PHPStan: composer require --dev phpstan/phpstan');
        io()->info('Or install Larastan (Laravel-optimized): composer require --dev larastan/larastan');
    }
}

#[AsTask(description: 'Run the PHPUnit task')]
function phpunit(bool $coverage = false): void
{
    if ($coverage) {
        // Pour la couverture, utiliser directement PHPUnit avec Xdebug
        artisan(['test', '--coverage-html', 'storage/app/coverage'])->run();
    } else {
        // Utiliser le script Laravel 'test' qui fait php artisan test
        composer(['run', 'test'])->run();
    }
}
