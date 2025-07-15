'use client';

import { ReactNode } from 'react';

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
