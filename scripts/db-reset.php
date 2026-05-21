#!/usr/bin/env php
<?php

use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$force = in_array('--force', $_SERVER['argv'], true);

if (! $force) {
    echo "⚠  This will DELETE all data in the database.\n";
    echo 'Are you sure? (y/N): ';
    $confirm = trim(fgets(STDIN));

    if (! in_array(strtolower($confirm), ['y', 'yes'], true)) {
        echo "Aborted.\n";
        exit(0);
    }
}

$dbPath = database_path('database.sqlite');

if (file_exists($dbPath)) {
    unlink($dbPath);
    echo "→ Database removed.\n";
}

touch($dbPath);
echo "→ Fresh database created.\n";

Artisan::call('migrate', ['--force' => true]);
echo Artisan::output();

echo "→ Database nuked and migrated.\n";
