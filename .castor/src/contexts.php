<?php

declare(strict_types=1);

use Castor\Attribute\AsContext;
use Castor\Context;

use function Castor\fs;
use function Castor\io;
use function Castor\load_dot_env;

#[AsContext(default: true)]
function root_context(): Context
{
    $workingDirectory = docker()->isRunningInDocker() ? '/app' : dirname(__DIR__, 2) . '/app';
    $envFileLocation = "{$workingDirectory}/.env";
    if (fs()->exists($envFileLocation)) {
        load_dot_env($envFileLocation);
    } else {
        io()->warning("The .env file is not found at {$envFileLocation}.");
    }

    return new Context(
        data: [
            'deploy_context' => new DeployContext(
                registryUrl: 'docker-registry.theo-corp.fr/theod02',
                imageName: 'php-docker',
            ),
        ],
        environment: $_SERVER,
        workingDirectory: $workingDirectory,
    );
}
