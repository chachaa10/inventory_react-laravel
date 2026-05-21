<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

beforeEach(function (): void {
    config()->set('services.google.client_id', 'test-client-id');
    config()->set('services.google.client_secret', 'test-client-secret');
    config()->set('services.google.redirect', 'http://localhost:8000/auth/google/callback');
});

test('guest is redirected to Google for OAuth', function (): void {
    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirectContains('accounts.google.com');
});

test('new user is created via Google OAuth callback', function (): void {
    $socialiteUser = (new SocialiteUser)
        ->map([
            'id' => 'google-123',
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ])
        ->setToken('token')
        ->setRefreshToken('refresh')
        ->setExpiresIn(3600);

    Socialite::shouldReceive('driver->user->getId')->andReturn('google-123');
    Socialite::shouldReceive('driver->user->getName')->andReturn('John Doe');
    Socialite::shouldReceive('driver->user->getEmail')->andReturn('john@example.com');

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect('/dashboard');

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'google_id' => 'google-123',
        'name' => 'John Doe',
    ]);

    $user = User::query()->where('email', 'john@example.com')->first();
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->password)->toBeNull();
});

test('existing user is linked via Google OAuth callback', function (): void {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'google_id' => null,
    ]);

    Socialite::shouldReceive('driver->user->getId')->andReturn('google-456');
    Socialite::shouldReceive('driver->user->getName')->andReturn('Jane Doe');
    Socialite::shouldReceive('driver->user->getEmail')->andReturn('jane@example.com');

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect('/dashboard');

    $user->refresh();
    expect($user->google_id)->toBe('google-456');
});

test('existing user with google_id logs in via Google OAuth', function (): void {
    $user = User::factory()->create([
        'email' => 'existing@example.com',
        'google_id' => 'google-789',
    ]);

    Socialite::shouldReceive('driver->user->getId')->andReturn('google-789');
    Socialite::shouldReceive('driver->user->getName')->andReturn('Existing User');
    Socialite::shouldReceive('driver->user->getEmail')->andReturn('existing@example.com');

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect('/dashboard');

    $user->refresh();
    expect($user->google_id)->toBe('google-789');
});
