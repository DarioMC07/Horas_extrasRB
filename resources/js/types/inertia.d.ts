import { PageProps } from '@inertiajs/core';

declare module '@vitejs/plugin-react/preamble';

declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                role: 'admin' | 'supervisor' | 'empleado';
            };
        };
        errors: Record<string, string>;
    }
}

declare global {
    function route(name: string, params?: any, absolute?: boolean): string;
}

export {};
