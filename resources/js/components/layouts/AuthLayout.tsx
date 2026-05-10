import { type ReactNode } from 'react';
import Logo from './Logo';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-wise-bg px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center">
                    <Logo className="flex-col items-center" showText={false} />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold text-wise-black">Horas Extras</h1>
                    <p className="mt-1 text-sm text-wise-gray">Sistema de gestión</p>
                </div>
                <div className="rounded-lg bg-wise-surface p-8 shadow-card">{children}</div>
            </div>
        </div>
    );
}
