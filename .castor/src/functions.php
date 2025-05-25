<?php

declare(strict_types=1);

use Castor\Attribute\AsOption;
use Castor\Attribute\AsTask;

use function Castor\context;
use function Castor\fs;
use function Castor\io;

/**
 * @param array<string> $args
 */
function docker(array $args = []): Docker
{
    return new Docker($args);
}

/**
 * @param array<string> $args
 */
function php(array $args = [], string $user = 'appuser'): Docker
{
    if (docker()->isRunningInDocker()) {
        return docker($args);
    }

    return docker(['compose', 'exec', '-it', '--user', $user, 'php', ...$args]);
}

function artisan(array $args): Docker
{
    return php(['php', 'artisan', ...$args]);
}

function composer(array $args): Docker
{
    if (fs()->exists(context()->workingDirectory . '/composer.json') === false) {
        io()->error('There is no composer.json file in the app directory.');
        exit(1);
    }

    return php(['composer', ...$args]);
}

/**
 * @param array<string> $args
 */
function front(array $args, string $user = 'appuser'): Docker
{
    if (docker()->isRunningInDocker()) {
        return docker($args);
    }

    return docker(['compose', 'exec', '-it', '--user', $user, 'php', ...$args]);
}

function npm(array $args): Docker
{
    if (fs()->exists(context()->workingDirectory . '/package.json') === false) {
        io()->error('There is no package.json file in the front directory.');
        exit(1);
    }

    return front(['npm', ...$args]);
}

#[AsTask(description: 'Access the shell of the container (PHP or Front)')]
function shell(
    #[AsOption(description: 'Run the shell of the front container')]
    bool $front = false,
    #[AsOption(description: 'Run the shell as root')]
    bool $root = false,
): void {
    if (docker()->isRunningInDocker()) {
        io()->warning('Could not run this task inside the container.');

        return;
    }

    if ($front) {
        front(['bash'], user: $root ? 'root' : 'appuser')->run();

        return;
    }

    php(['fish'], user: $root ? 'root' : 'appuser')->run();
}
