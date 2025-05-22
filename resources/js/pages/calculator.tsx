import AppLayout from '@/layouts/app-layout';
import { clientSideDownload } from '@/lib/utils';
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
    const [name, setName] = useState('');

    const precioTotal = !isNaN(ius) ? ius * parseInt(precio_ius as string) : undefined;

    const downloadPDF = async () => {
        const head: string = `
            <style>  
                div, label { font-size: 14px; }
                label { font-weight: bold; }
                .body { margin-top: 2em; }
                .final-price { margin-top: 1em; }
                .rule { border-top: 1px solid gray; margin-top: 1em; }
            </style>
        `;
        const body: string = `
                <div class="fecha"><label>Fecha:</label> ${today} </div>
                <div class="client"><label>Cliente:</label> ${name} </div>
                <div class="rule" />
                <div class="body"> 
                   <div>Precio IUS: ${priceFormatter.format(precio_ius as any)}</div>
                   <div>Cantidad: ${ius}</div>
                   <div class="final-price">TOTAL: ${priceFormatter.format(precioTotal as any)}</div>
                </div>
        `;
        const response = await fetch('/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content,
            },
            body: JSON.stringify({
                title: 'Notificacion',
                head,
                body,
            }),
        });

        if (!response.ok) {
            console.error('Error al generar el PDF');
            return;
        }

        const blob = await response.blob();
        clientSideDownload(blob, 'Presupuesto.pdf');
    };

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
                        <div className="client-wrapper">
                            Nombre :
                            <input type="text" className="client-input" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="ius-input-wrapper">
                            Cantidad de IUS :
                            <input type="text" className="ius-input" onChange={(e) => setIus(parseInt(e.target.value))} />
                        </div>
                        <div className="ius-final-price">
                            Precio total: <span className="price">{precioTotal && priceFormatter.format(precioTotal)}</span>
                        </div>
                        <div className="print-wrapper">
                            <input
                                type="button"
                                className="button"
                                value="Imprimir"
                                disabled={name.trim().length === 0 || isNaN(ius)}
                                onClick={() => downloadPDF()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
