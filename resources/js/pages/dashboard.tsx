import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useDashboardStore } from './subcomponents/DashboardStore';
import PjnNotifications from './subcomponents/PjnNotifications';
import ScbaNotifications from './subcomponents/ScbaNotifications';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Inicial',
        href: '/dashboard',
    },
];

const fechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

export default function Dashboard() {
    const [fecha, setFecha] = useState<string>(fechaActual());
    const [fechaConfirmada, setFechaConfirmada] = useState<string>('');
    const { loadingPjn, loadingScba } = useDashboardStore();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="m-2 mt-5">
                        Notificaciones para el dia:
                        <input
                            type="text"
                            className="w-[110px] border border-black p-1"
                            maxLength={10}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                        <input
                            type="button"
                            value="Consultar"
                            className="button m-2"
                            disabled={loadingPjn || loadingScba}
                            onClick={() => setFechaConfirmada(fecha)}
                        />
                        <ScbaNotifications fecha={fechaConfirmada} />
                        <PjnNotifications fecha={fechaConfirmada} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
