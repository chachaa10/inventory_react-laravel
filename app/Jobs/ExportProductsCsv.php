<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use App\Notifications\ExportReady;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExportProductsCsv implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public User $user,
    ) {}

    public function handle(): void
    {
        $products = Product::with('category', 'supplier')->get();

        $filename = sprintf('exports/products-%s.csv', now()->format('Ymd-His'));

        $stream = fopen('php://temp', 'w+');
        if ($stream === false) {
            Log::error('Failed to create temporary stream for CSV export.');

            return;
        }

        fputcsv($stream, ['Name', 'SKU', 'Description', 'Price', 'Cost', 'Stock Qty', 'Unit', 'Reorder Level', 'Category', 'Supplier', 'Active'], escape: '\\');

        foreach ($products as $product) {
            fputcsv($stream, [
                $product->name,
                $product->sku,
                $product->description,
                $product->price,
                $product->cost,
                $product->stock_qty,
                $product->unit,
                $product->reorder_level,
                $product->category?->name,
                $product->supplier?->name,
                $product->is_active ? 'Yes' : 'No',
            ],
                escape: '\\');
        }

        rewind($stream);
        $csv = stream_get_contents($stream);
        fclose($stream);

        if ($csv === false) {
            Log::error('Failed to read CSV stream content.');

            return;
        }

        Storage::disk('local')->put($filename, $csv);

        $notification = DatabaseNotification::query()
            ->where('type', ExportReady::class)
            ->where('notifiable_id', $this->user->getKey())
            ->where('notifiable_type', $this->user->getMorphClass())
            ->latest()
            ->first();

        if ($notification !== null) {
            $data = $notification->data;
            $data['file'] = $filename;
            $data['status'] = 'completed';
            $data['message'] = 'Product export is ready for download.';
            $notification->data = $data;
            $notification->save();
        }
    }
}
