<?php

namespace App\Listener;

use Symfony\Component\DependencyInjection\Attribute\WhenNot;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(KernelEvents::EXCEPTION, priority: 1)]
#[WhenNot(env: 'dev')]
class ExceptionListener
{
    public function __invoke(ExceptionEvent $event): void
    {
        $event->setResponse(
            new JsonResponse(
                [
                    'message' => $event->getThrowable()->getMessage(),
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            )
        );
    }
}