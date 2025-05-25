<?php

declare(strict_types=1);

readonly class DeployContext
{
    public function __construct(
        /**
         * @var string The URL of the registry to push the image to. (e.g. `docker.pkg.github.com/acme`)
         */
        public string $registryUrl,
        /**
         * @var string The name of the image to push. (e.g. `my-image`)
         */
        public string $imageName,
    ) {
        if (empty($this->registryUrl)) {
            throw new InvalidArgumentException('The registry URL cannot be empty.');
        }

        if (empty($this->imageName)) {
            throw new InvalidArgumentException('The image name cannot be empty.');
        }
    }
}
