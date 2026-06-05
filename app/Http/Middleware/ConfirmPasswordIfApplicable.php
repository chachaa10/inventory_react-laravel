<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfirmPasswordIfApplicable
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || $user->password === null) {
            /** @var Response $response */
            $response = $next($request);

            return $response;
        }

        /** @var int|null $confirmedAt */
        $confirmedAt = $request->session()->get('auth.password_confirmed_at');

        if ($confirmedAt === null || (time() - $confirmedAt) > config('auth.password_timeout', 10800)) {
            return redirect()->guest(route('password.confirm'));
        }

        /** @var Response $response */
        $response = $next($request);

        return $response;
    }
}
