<?php

declare(strict_types=1);

use Attributes\ShouldNotRunInsideContainer;
use Castor\Attribute\AsListener;
use Castor\Event\BeforeExecuteTaskEvent;
use Castor\Event\ProcessStartEvent;

use function Castor\io;

#[AsListener(BeforeExecuteTaskEvent::class)]
function prevent_run_in_docker_container(BeforeExecuteTaskEvent $event): void
{
    $reflection = new ReflectionClass($event->task);
    $reflection->getProperty('taskDescriptor')->setAccessible(true);

    $taskDescriptor = $reflection->getProperty('taskDescriptor')->getValue($event->task);
    $attribute = $taskDescriptor->function->getAttributes(ShouldNotRunInsideContainer::class)[0] ?? null;

    $message = $attribute?->newInstance()->message ?? 'Could not run this task inside the container.';

    if ($attribute !== null && docker()->isRunningInDocker()) {
        io()->warning($message);
        exit(1);
    }
}

#[AsListener(ProcessStartEvent::class)]
function log_process_start(ProcessStartEvent $event): void
{
    $commands = $event->process->getCommandLine();
    $commands = array_map(static fn (string $cmd) => trim($cmd, "'"), explode(' ', $commands));
    $commands = implode(' ', $commands);

    $silents = ['echo $HOME', 'docker compose images', 'docker compose ps --services'];

    if (in_array($commands, $silents, true)) {
        return;
    }

    $prefix = str_contains($commands, 'docker') ? '[docker]' : '[local]';
    io()->writeln("> <info>{$prefix}</info> <comment>{$commands}</comment>");
}
