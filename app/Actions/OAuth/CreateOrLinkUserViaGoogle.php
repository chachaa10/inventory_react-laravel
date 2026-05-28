<?php

declare(strict_types=1);

namespace App\Actions\OAuth;

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class CreateOrLinkUserViaGoogle
{
    public function handle(): User
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::query()->firstWhere('email', $googleUser->getEmail());

        if ($user !== null) {
            if ($user->google_id === null) {
                $user->forceFill(['google_id' => $googleUser->getId()])->save();
            }

            return $user;
        }

        return tap(User::query()->create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
        ]), fn (User $user) => $user->forceFill(['email_verified_at' => now()])->save());
    }
}
