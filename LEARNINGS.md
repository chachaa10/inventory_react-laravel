# Critical Learnings

## Frontend

### Routing
- **Inertia::location() for binary downloads**: [×1, 2026-05-31] To serve binary file downloads from an Inertia app, return Inertia::location(downloadUrl). This returns 409 with X-Inertia-Location header, telling the client to do window.location = url (full browser nav). Direct RedirectResponse gets followed by Inertia via fetch (keeping X-Inertia header), then the StreamedResponse triggers the empty-response redirect-back bug.

### Forms
- **Form must be inside DialogContent**: [×1, 2026-05-31] In shadcn Radix, <Form> must be inside <DialogContent> (not outside) — portal renders at <body> level so form outside content breaks nesting.
- **Button requires explicit type**: [×1, 2026-05-31] The <Button> component requires type explicitly — always write type='button' or type='submit'. <button> defaults to 'submit' inside <form>, so omitting type is dangerous.

### Data Display
- **accessorKey does not resolve dot notation**: [×1, 2026-05-31] Table accessorFn accessorKey does NOT resolve nested dot notation ('product.name' → undefined). Use accessorFn: (row) => row.product?.name instead.
- **Cell renderers must be module-level functions**: [×1, 2026-05-31] DataGrid cell renderers must be extracted to module-level functions taking { row }: { row: Row<T> }. Defining inline is blocked by oxlint's react/no-unstable-nested-components rule.

### Build/Types
- **tsc errors on .form() are pre-existing**: [×1, 2026-05-31] tsc --noEmit errors on .form() are pre-existing across the project — the Vite plugin provides it at build time, typechecker can't resolve virtual modules. Ignore these errors.
- **noUncheckedIndexedAccess bracket notation**: [×1, 2026-05-31] TypeScript strict rule noUncheckedIndexedAccess requires bracket notation for dynamic access — errors['field'], user['role'], user['name']. Never use dot notation like errors.field.

## Backend

### Handlers
- **Inertia middleware eats StreamedResponse**: [×1, 2026-05-31] StreamedResponse::getContent() returns false (empty), matching Inertia middleware's empty-response check at vendor/inertiajs/inertia-laravel/src/Middleware.php:153 (->isOk() && empty(->getContent()) → onEmptyResponse → redirect back). Storage::download() returns StreamedResponse, so file downloads get silently swallowed. Fix: use Inertia::location() to force full browser navigation instead.
- **Dynamic call to static method false positive**: [×1, 2026-05-31] PHPStan flags dynamic calls on Eloquent Builder methods (orderBy, lockForUpdate, select, etc) as 'Dynamic call to static method'. Fix: use builder->getQuery()->methodName() to bypass.
- **throw_if inside closures corrupts PHPStan cache**: [×1, 2026-05-31] throw_if inside closures: fresh PHPStan analysis passes, cached run fails with 'Unreachable statement' / 'Property never read'. Fix: extract guard logic into private methods where throw_if is the last statement so nothing follows that could be flagged unreachable.
- **always-read-written-properties blind to reads in closures**: [×1, 2026-05-31] Property reads inside DB::transaction closures aren't tracked by PHPStan's always-read-written-properties rule. Extract a private method that reads the property at class level to make it visible.
- **getQuery-take mutates builder by reference**: [×1, 2026-05-31] getQuery()->take(5) mutates the Eloquent builder by reference. The constraint persists even though only the terminal method changes — calling ->with('...')->latest()->get() still returns Eloquent models with the take constraint.
- **Implicit route binding param name mismatch**: [×1, 2026-05-31] Controller param name must match route placeholder — otherwise binding silently skips and controller gets empty model. Use Route::model('param', Model::class) in AppServiceProvider::boot() when rector renames params away from route param.
- **git checkout revert only kills tracked files**: [×1, 2026-05-31] git checkout on a tracked file reverts that file but untracked files survive. If a controller/route file was modified alongside new untracked files, revert silently kills controller logic while actions/exceptions still exist. Always git status after reset.

### ORM/Data Access
- **findOrFail returns Collection|Model**: [×1, 2026-05-31] findOrFail returns Model|Collection — use `$query->where('id', $id)->firstOrFail()` for narrow TModel type instead.
- **selectRaw via getQuery() returns mixed**: [×1, 2026-05-31] selectRaw via getQuery() returns Collection<stdClass> with mixed properties — every column needs is_string/is_int guard with throw, bare casts on mixed are rejected.
- **lockForUpdate + stale reference**: [×1, 2026-05-31] Locking a row but discarding the result leaves stale data. Read the column directly from the locked query in one round-trip.
- **SoftDeletes eager loading adds deleted_at IS NULL**: [×1, 2026-05-31] Eager loading with ->with('relation') implicitly adds WHERE deleted_at IS NULL on related model. Use LEFT JOIN with aliased columns instead for trashed rows.
- **DatabaseNotification::markAsRead inserts instead of updates**: [×1, 2026-05-31] If model->exists is false (e.g. failed implicit route binding), markAsRead() runs performInsert() with no id, causing NOT NULL constraint failure. The model must have exists=true before marking read.

### Events
- **Laravel 11 double event registration**: [×1, 2026-05-31] Both App\Providers\EventServiceProvider AND base Illuminate\Foundation\Support\Providers\EventServiceProvider register. Base class's shouldDiscoverEvents() returns true for itself, so auto-discovery runs independently of subclass. A listener registered via $listen AND auto-discovered fires twice. Fix: call EventServiceProvider::disableEventDiscovery().
- **Low stock notification fires on every movement**: [×1, 2026-05-31] Every stock movement leaving stock <= reorder_level fires notification. If already low, subsequent movements create duplicates. Fix: check transition — only fire when beforeQty > reorder_level && afterQty <= reorder_level.

### Validation
- **intval() on mixed rejected by PHPStan**: [×1, 2026-05-31] intval(mixed) is rejected by PHPStan max level. Use is_int() guard with throw instead of bare intval() cast.
- **Number::currency returns string|false**: [×1, 2026-05-31] Number::currency() returns string|false. Use long ternary (`$x !== false ? $x : '$0.00'`), not short ternary ?: (banned by ternary.shortNotAllowed rule).

### Types/Static Analysis
- **fake()->randomElement(Enum::cases()) returns mixed**: [×1, 2026-05-31] fake()->randomElement(Enum::cases())->value is rejected because randomElement returns mixed. Fix: `array_map(fn($t) => $t->value, Enum::cases())` to produce typed list<string>, then use randomElement on that.
- **Enum-casted attributes read as string inside closures**: [×1, 2026-05-31] Enum-casted model attributes ->value inside map() closures is seen as 'string->value'. Fix: `is_string($movement->type) ? $movement->type : $movement->type->value` — or extract to private method with is_string guard.

## Database