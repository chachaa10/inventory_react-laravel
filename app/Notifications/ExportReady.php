<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ExportReady extends Notification
{
    use Queueable;

    public function __construct(
        public ?string $filename = null,
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        if ($this->filename !== null) {
            return [
                'file' => $this->filename,
                'status' => 'completed',
                'message' => 'Product export is ready for download.',
            ];
        }

        return [
            'file' => null,
            'status' => 'processing',
            'message' => 'Product export is being prepared.',
        ];
    }
}
