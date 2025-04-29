import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Inicial',
        href: '/dashboard',
    },
];

const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function Dashboard() {
    const { auth, precio_ius } = usePage().props;
    const [ius, setIus] = useState<number>(NaN);

    const precioTotal = !isNaN(ius) ? ius * parseInt(precio_ius as string) : undefined;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="m-2">Usuario conectado: {(auth as any).user.name} </div>

                    <div className="m-2 border bg-[rgb(240,240,240)] p-3">
                        Precio IUS: <span className="text-[rgb(150,100,100)]">{priceFormatter.format(precio_ius as any)}</span> <br />
                        Cantidad de IUS :
                        <input
                            type="text"
                            className="w-[30px] rounded-sm border border-black bg-[rgb(220,220,220)] p-[3px]"
                            onChange={(e) => setIus(parseInt(e.target.value))}
                        />
                        {precioTotal && (
                            <span className="ml-3 border border-black p-1 text-lg font-bold"> {priceFormatter.format(precioTotal)} </span>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
