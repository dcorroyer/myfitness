<?php

declare(strict_types=1);

namespace docker;

use Attributes\ShouldNotRunInsideContainer;
use Castor\Attribute\AsOption;
use Castor\Attribute\AsTask;

use function Castor\io;

#[AsTask(description: 'Start the containers', aliases: ['up', 'start'])]
#[ShouldNotRunInsideContainer]
function start(#[AsOption(description: 'Do not use cache when building the images')] bool $noCache = false): void
{
    docker(['compose', 'build'])
        ->addIf($noCache, '--no-cache')
        ->run()
    ;

    docker(['compose', 'up', '-d', '--wait', '--remove-orphans'])->run();
}

#[AsTask(description: 'Stop the containers', aliases: ['stop'])]
#[ShouldNotRunInsideContainer]
function stop(): void
{
    docker(['compose', 'stop'])->run();
}

#[AsTask(description: 'Cleans the infrastructure (remove container, volume, networks)', aliases: ['clean'])]
#[ShouldNotRunInsideContainer]
function destroy(
    #[AsOption(shortcut: 'f', description: 'Force the destruction without confirmation')]
    bool $force = false,
): void {
    if (! $force) {
        io()->warning([
            'This will remove all the containers, networks, and volumes.',
            'This action is irreversible.',
        ]);

        if (! io()->confirm('Do you want to continue?')) {
            return;
        }
    }

    docker(['compose', 'stop', '--volumes', '--remove-orphans', '--rmi', 'local'])->run();
}

#[AsTask(description: 'Restart the containers', aliases: ['restart'])]
#[ShouldNotRunInsideContainer]
function restart(#[AsOption(description: 'Do not use cache when building the images')] bool $noCache = false): void
{
    stop();
    start($noCache);
}

#[AsTask(description: 'Access the logs of the containers')]
#[ShouldNotRunInsideContainer]
function logs(
    #[AsOption(description: 'The container to access the logs', autocomplete: ['php', 'front'])]
    ?string $container = null,
): void {
    if ($container === null) {
        docker(['compose', 'logs', '--tail', '100', '--follow'])->run();

        return;
    }

    if (! \in_array($container, ['php', 'front'], true)) {
        io()->error('The container must be either "php" or "front".');

        return;
    }

    docker(['compose', 'logs', '--tail', '100', '--follow', $container])->run();
}
