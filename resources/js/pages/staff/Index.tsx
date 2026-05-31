import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

import {
    destroy as deactivateUser,
    update as updateUser,
} from '@/actions/App/Http/Controllers/StaffController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { Paginated } from '@/types';

import { StaffTable } from './components/StaffTable';
import type { StaffUser } from './components/StaffTable';

type StaffIndexProps = {
    users: Paginated<StaffUser>;
};

export default function StaffIndex({ users }: StaffIndexProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<StaffUser | null>(null);
    const [deactivateId, setDeactivateId] = useState<number | null>(null);

    function openEdit(user: StaffUser) {
        setEditing(user);
        setSheetOpen(true);
    }

    return (
        <>
            <Head title="Staff Management" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Staff Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage user roles and access.
                    </p>
                </div>
            </div>

            <Sheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setEditing(null);
                    }
                }}
            >
                <SheetContent>
                    {editing && (
                        <Form
                            {...updateUser.form(editing.id)}
                            key={editing.id}
                            onSuccess={() => {
                                setSheetOpen(false);
                                setEditing(null);
                            }}
                            resetOnSuccess
                        >
                            {({ processing, errors }) => (
                                <>
                                    <SheetHeader>
                                        <SheetTitle>Edit Staff User</SheetTitle>
                                        <SheetDescription>
                                            Update user role or re-activate an
                                            inactive account.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-8 space-y-3 px-8">
                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={editing.name}
                                                />
                                                {errors['name'] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors['name']}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={editing.email}
                                                />
                                                {errors['email'] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors['email']}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="role">
                                                    Role
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name="role"
                                                    value={
                                                        editing.role === 'admin'
                                                            ? 'admin'
                                                            : 'staff'
                                                    }
                                                />
                                                <Select
                                                    value={
                                                        editing.role === 'admin'
                                                            ? 'admin'
                                                            : 'staff'
                                                    }
                                                    onValueChange={(value) =>
                                                        setEditing(
                                                            (prev) =>
                                                                prev && {
                                                                    ...prev,
                                                                    role: value,
                                                                },
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            Admin
                                                        </SelectItem>
                                                        <SelectItem value="staff">
                                                            Staff
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors['role'] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors['role']}
                                                    </p>
                                                )}
                                            </div>
                                            {!editing.is_active && (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="hidden"
                                                        name="is_active"
                                                        value="true"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Saving will re-activate
                                                        this user.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4">
                                            <Button
                                                className="w-full"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Saving...'
                                                    : 'Update'}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </SheetContent>
            </Sheet>

            <StaffTable
                users={users}
                onEdit={openEdit}
                onDeactivate={setDeactivateId}
            />

            {deactivateId !== null && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeactivateId(null);
                        }
                    }}
                >
                    <DialogContent
                        showCloseButton={false}
                        className="sm:max-w-sm"
                    >
                        <Form
                            {...deactivateUser.form(deactivateId)}
                            key={deactivateId}
                            onSuccess={() => setDeactivateId(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Deactivate User
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure? The user will be
                                            deactivated and unable to log in.
                                            Their historical records will be
                                            preserved.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() =>
                                                setDeactivateId(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Deactivate
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
