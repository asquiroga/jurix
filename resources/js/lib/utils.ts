import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const fueroPretty = (id: number) => {
    if (id === 1) return 'Civil y Comercial';
    if (id === 2) return 'Contencioso Administrativo';
    if (id === 3) return 'Familia';
    if (id === 4) return 'Laboral';
};

export const clientSideDownload = (blob: any, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const formatArPrice = (price: number) => priceFormatter.format(price);

// Elimina ceros a la izquierda y formatea con puntos
export const priceWithDots = (numStr: string) => {
    const num = numStr.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const fuerosOptions = [
    {
        value: 1,
        text: 'Civil y Comercial',
    },
    {
        value: 2,
        text: 'Contencioso Administrativo',
    },
    {
        value: 3,
        text: 'Familia',
    },
    {
        value: 4,
        text: 'Laboral',
    },
];
