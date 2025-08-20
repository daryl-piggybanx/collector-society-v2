"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export function PostHogClientProvider({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        posthog.init(import.meta.env.VITE_POSTHOG_KEY!, {
            api_host: import.meta.env.VITE_POSTHOG_HOST,
            capture_pageview: "history_change",
            person_profiles: "always", // 'identified_only' for GDPR compliance
        });
        setHydrated(true);
    }, []);
    
    // Wait for PostHog to be hydrated before rendering the children
    if (!hydrated) return <>{children}</>;

    return (
        <PostHogProvider client={posthog}>
            {children}
        </PostHogProvider>
    );
}