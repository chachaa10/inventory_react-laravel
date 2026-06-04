<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use App\Policies\StaffPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        EventServiceProvider::disableEventDiscovery();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::model('notification', DatabaseNotification::class);

        $this->configureDefaults();

        Gate::policy(User::class, StaffPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
