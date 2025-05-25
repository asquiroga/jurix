import AnimatedTitle from '@/components/AnimatedTitle';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { clientSideDownload, formatArPrice } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export const IusCalculator = () => {
    const { precio_ius, today } = usePage().props;
    const [ius, setIus] = useState<number>(NaN);
    const [name, setName] = useState('');

    const precioTotal = !isNaN(ius) ? ius * parseInt(precio_ius as string) : undefined;

    const [nose, setNose] = useState('');

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
                   <div>Precio IUS: ${formatArPrice(precio_ius as any)}</div>
                   <div>Cantidad: ${ius}</div>
                   <div class="final-price">TOTAL: ${formatArPrice(precioTotal as any)}</div>
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
        <div>
            <AnimatedTitle title="Calculadora de IUS" />

            <div>
                Fecha: <span className="date-today">{today as any}</span>
            </div>
            <div>
                Precio IUS: <span className="ius-price">{formatArPrice(precio_ius as any)}</span> <br />
            </div>
            <div className="client-wrapper">
                <FloatingLabelInput label="Nombre" value={name} onChange={(e: any) => setName(e.target.value)} id="ius-nombre" />
            </div>

            <div className="client-wrapper">
                <FloatingLabelInput
                    label="Cantidad de IUS"
                    value={isNaN(ius) ? '' : (ius as any)}
                    onChange={(e: any) => setIus(parseInt(e.target.value))}
                    id="ius-nombre"
                />
            </div>
            <div className="ius-final-price">
                Precio total: <span className="price">{precioTotal && formatArPrice(precioTotal)}</span>
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
    );
};

export default IusCalculator;
