<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Models\Category;
use App\Models\Product;

class GenerateSkuAction
{
    public function execute(int $categoryId, string $productName, ?int $ignoreProductId = null): string
    {
        $category = Category::query()->findOrFail($categoryId);

        $prefix = $category->prefix ?? $this->derivePrefix($category->name);

        $abbreviation = $this->abbreviateName($productName);

        $sequence = $this->nextSequence($prefix, $abbreviation, $ignoreProductId);

        return sprintf('%s-%s-%s', $prefix, $abbreviation, $sequence);
    }

    private function derivePrefix(string $categoryName): string
    {
        $words = explode(' ', $categoryName);

        if (count($words) === 1) {
            return strtoupper(substr($categoryName, 0, 3));
        }

        $prefix = '';

        foreach ($words as $word) {
            $prefix .= strtoupper($word[0]);
        }

        return $prefix;
    }

    private function abbreviateName(string $productName): string
    {
        $words = preg_split('/[\s\-]+/', $productName);

        if ($words === false || $words === []) {
            return 'XXX';
        }

        $significant = array_filter($words, function (string $word): bool {
            $lower = strtolower($word);

            return ! in_array($lower, ['the', 'a', 'an', 'and', 'or', 'of', 'for', 'with', 'by'], true);
        });

        if ($significant === []) {
            $significant = $words;
        }

        $abbreviation = '';

        foreach ($significant as $word) {
            $abbreviation .= strtoupper(mb_substr($word, 0, 1));
        }

        return mb_substr($abbreviation, 0, 5);
    }

    private function nextSequence(string $prefix, string $abbreviation, ?int $ignoreProductId = null): string
    {
        $pattern = sprintf('%s-%s-%%', $prefix, $abbreviation);

        $count = Product::query()
            ->where('sku', 'like', $pattern)
            ->when($ignoreProductId !== null, fn ($q) => $q->where('id', '!=', $ignoreProductId))
            ->getQuery()
            ->count();

        return str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);
    }
}
