import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
    CheckCircleIcon,
    InfoIcon,
    WarningIcon,
    XCircleIcon,
    SpinnerIcon,
} from "@phosphor-icons/react";

import { useAppearance } from "@/hooks/use-appearance";

const Toaster = ({ ...props }: ToasterProps) => {
    const { appearance } = useAppearance();

    return (
        <Sonner
            theme={appearance as Exclude<ToasterProps["theme"], undefined>}
            className="toaster group"
            richColors
            icons={{
                success: <CheckCircleIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <WarningIcon className="size-4" />,
                error: <XCircleIcon className="size-4" />,
                loading: <SpinnerIcon className="size-4 animate-spin" />,
            }}
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    "--error-bg": "var(--destructive)",
                    "--error-text": "var(--destructive-foreground)",
                    "--error-border": "var(--destructive)",
                    "--border-radius": "var(--radius)",
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: "cn-toast",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
