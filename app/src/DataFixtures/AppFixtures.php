<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
    )
    {
    }

    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $user =
        UserFactory::new()
            ->with(['email' => 'admin@domain.tld'])
            ->afterInstantiate(function (UserInterface $user) {
                $user->setPassword($this->passwordHasher->hashPassword($user, 'admin'));
            })
            ->create();

        $manager->flush();
    }
}
