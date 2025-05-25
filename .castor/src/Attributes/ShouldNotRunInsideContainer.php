<?php

declare(strict_types=1);

namespace Attributes;

#[\Attribute(\Attribute::TARGET_FUNCTION)]
class ShouldNotRunInsideContainer
{
    public function __construct(
        public readonly string $message = 'Could not run this task inside the container.',
    ) {
    }
}
