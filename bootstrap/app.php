<?php

declare(strict_types=1);

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $throwable, Request $request) {
            if ($throwable instanceof HttpException
                || $throwable instanceof ValidationException
                || $throwable instanceof AuthenticationException
            ) {
                return;
            }

            report($throwable);

            Inertia::flash('toast', ['type' => 'error', 'message' => 'Something went wrong.']);

            return back();
        });

        $exceptions->respond(function (Response $response): RedirectResponse|Response {
            $status = $response->getStatusCode();

            if ($status === 403) {
                Inertia::flash('toast', ['type' => 'error', 'message' => 'This action is unauthorized.']);

                return back();
            }

            if ($status === 419) {
                Inertia::flash('toast', ['type' => 'error', 'message' => 'Page expired, please try again.']);

                return back();
            }

            return $response;
        });
    })->create();
