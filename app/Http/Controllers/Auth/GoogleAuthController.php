<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\OAuth\CreateOrLinkUserViaGoogle;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class GoogleAuthController
{
    public function redirect(Request $request): SymfonyRedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request, CreateOrLinkUserViaGoogle $action): RedirectResponse
    {
        try {
            $user = $action->handle();

            Auth::guard()->login($user, remember: true);

            return redirect()->intended('/dashboard');
        } catch (Exception) {
            return to_route('login')->with('error', 'Unable to sign in with Google. Please try again.');
        }
    }
}
