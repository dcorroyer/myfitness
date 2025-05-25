<?php

declare(strict_types=1);

namespace deploy;

use Attributes\ShouldNotRunInsideContainer;
use Castor\Attribute\AsOption;
use Castor\Attribute\AsTask;
use Symfony\Component\Console\Input\InputOption;

use function Castor\capture;
use function Castor\context;
use function Castor\io;

/**
 * @throws \DateMalformedStringException
 */
#[AsTask(description: 'Build and push the image to docker registry', aliases: ['deploy'])]
#[ShouldNotRunInsideContainer('Building the image must be done outside the container')]
function build_and_push(
    #[AsOption(description: 'The target to build the image', autocomplete: ['integration', 'prod'])]
    ?string $target = null,
    #[AsOption(mode: InputOption::VALUE_NEGATABLE, description: 'Push the image to the registry')]
    bool $push = true,
    #[AsOption(description: 'Do not use cache when building the images')]
    bool $noCache = false,
): void {
    io()->title('Building the image');

    /** @var ?\DeployContext $deployContext */
    $deployContext = context()->data['deploy_context'] ?? null;

    if ($deployContext === null) {
        $contextName = context()->name;
        throw new \InvalidArgumentException(
            "The context '{$contextName}' does not have a 'deploy_context' set in data."
        );
    }

    if ($target === null) {
        $target = io()->choice('Select the target', ['integration', 'prod'], 'prod');
    }

    if (! \in_array($target, ['integration', 'prod'], true)) {
        throw new \InvalidArgumentException('The target must be either "integration" or "prod"');
    }

    $version = "{$target}-0.0.1";
    $currentTime = (new \DateTime(timezone: new \DateTimeZone('Europe/Paris')))->format('Y-m-d\TH:i:s');
    $tag = "{$deployContext->registryUrl}/{$deployContext->imageName}:{$version}";

    io()->writeln([
        'Context: ' . context()->name,
        "Registry: {$deployContext->registryUrl}",
        "Image: {$deployContext->imageName}",
        "Version: {$version}",
        "Target: {$target}",
        "Tag: {$tag}",
        'No cache: ' . ($noCache ? 'yes' : 'no'),
        'Push: ' . ($push ? 'yes' : 'no'),
        "Build time: {$currentTime}",
        '',
    ]);

    if (io()->confirm('Do you want to continue?', false) === false) {
        io()->warning('Aborted');

        return;
    }

    docker(['build'])
        ->add(
            '--build-arg', "BUILD_TIME={$currentTime}",
            '--build-arg', "VERSION={$version}",
            '--file', context()->workingDirectory . '/Dockerfile',
            '--platform', 'linux/amd64',
            '--progress', 'plain',
            '--target', $target,
        )
        ->addIf($noCache, '--no-cache')
        ->addIf($push, '--push')
        ->add('--tag', $tag)
        ->add(context()->workingDirectory)
        ->run()
    ;

    $buildSize = capture(['docker', 'image', 'inspect', '--format', '{{.Size}}', $tag]);
    $buildSizeInMB = round($buildSize / 1024 / 1024, 2);

    io()->newLine(2);
    io()->success([
        'Image built successfully',
        "Image: {$tag}",
        "Version: {$version}",
        "Build time: {$currentTime}",
        "Size: {$buildSizeInMB} MB",
        '',
    ]);
}
