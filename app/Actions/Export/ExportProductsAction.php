<?php

declare(strict_types=1);

namespace App\Actions\Export;

use App\Jobs\ExportProductsCsv;
use App\Models\User;
use App\Notifications\ExportReady;

class ExportProductsAction
{
    public function execute(User $user): void
    {
        $user->notify(new ExportReady);

        dispatch(new ExportProductsCsv($user));
    }
}
