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

export const buildQueryString = (params: any) => {
    const queryString = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null)) as unknown as any[]).toString();
    return queryString;
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

const meses: Record<number, string> = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre',
};
// 2024/01 => "Enero/2024"
export const mesPretty = (value: string) => {
    const year = value.substring(0, 4);
    const month = parseInt(value.substring(5).trim());

    return `${meses[month as any]}/${year}`;
};
