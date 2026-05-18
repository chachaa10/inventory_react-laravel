<?php

test('home page loads', function (): void {
    $response = $this->get(route('home'));

    $response->assertOk();
});
