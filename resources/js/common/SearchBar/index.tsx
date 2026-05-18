import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
};

export function SearchBar({
    value,
    onChange,
    placeholder = 'Search...',
    debounceMs = 300,
}: SearchBarProps) {
    const [local, setLocal] = useState(value);
    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const next = e.target.value;
            setLocal(next);
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => onChange(next), debounceMs);
        },
        [onChange, debounceMs],
    );

    useEffect(() => {
        setLocal(value);
    }, [value]);

    useEffect(() => {
        return () => clearTimeout(timeout.current);
    }, []);

    return (
        <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                value={local}
                onChange={handleChange}
                placeholder={placeholder}
                className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
        </div>
    );
}
