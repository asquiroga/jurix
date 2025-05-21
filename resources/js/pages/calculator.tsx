import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/calculator.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calculadora',
        href: '/calculator',
    },
];

const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function Calculadora() {
    const { precio_ius, today } = usePage().props;
    const [ius, setIus] = useState<number>(NaN);

    const precioTotal = !isNaN(ius) ? ius * parseInt(precio_ius as string) : undefined;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calculadora" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="calculator-wrapper">
                        <div>
                            Fecha: <span className="date-today">{today as any}</span>
                        </div>
                        <div>
                            Precio IUS: <span className="ius-price">{priceFormatter.format(precio_ius as any)}</span> <br />
                        </div>
                        <div className="ius-input-wrapper">
                            Cantidad de IUS :
                            <input type="text" className="ius-input" onChange={(e) => setIus(parseInt(e.target.value))} />
                        </div>
                        <div className="ius-final-price">
                            Precio total: <span className="price">{precioTotal && priceFormatter.format(precioTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
