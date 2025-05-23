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
