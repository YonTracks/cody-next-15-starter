"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure the theme is loaded after hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid rendering icons on the server to prevent hydration errors
    if (!mounted) return <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>;

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg transition-all bg-gray-200 dark:bg-gray-700 hover:scale-105"
        >
            {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
                <Moon className="h-5 w-5 text-gray-900" />
            )}
        </button>
    );
}
