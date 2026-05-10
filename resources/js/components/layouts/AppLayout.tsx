import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ChatPanel from '../naturalquery/ChatPanel';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const { auth } = usePage().props as any;

    return (
        <div className="flex min-h-screen bg-wise-bg">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-1 flex-col">
                <Topbar
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                    onChatToggle={auth?.user?.role === 'admin' ? () => setChatOpen(!chatOpen) : undefined}
                />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
            <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
