import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { fueroPretty } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Materias',
        href: '/dashboard',
    },
];

export default function Materias() {
    const { materias } = usePage().props;

    const updateFilter = (e: any) => {
        const value = e.target.value;
        if (!value) {
            router.get('/materias', {}, { preserveState: true, preserveScroll: true });
            return;
        }
        router.get('/materias', { fuero: value }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materias" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <HeadingSmall title="Lista de Materias" />

                    <Button variant="outline">Agregar Materia</Button>

                    <div className="m-2">
                        Filtrar :
                        <select className="border-blue border" onChange={updateFilter}>
                            <option value="">-- Selecciona una opción --</option>=<option value="1">Civil y Comercial</option>
                            <option value="2">Contencioso Administrativo</option>
                            <option value="3">Familia </option>
                            <option value="4">Laboral </option>
                        </select>
                    </div>

                    <table className="m-3 w-full table-auto border border-gray-300">
                        <thead>
                            <tr>
                                <th className="p-1 text-left">Nombre</th>
                                <th className="text-left">Codigo SCBA</th>
                                <th className="text-left">Fuero</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(materias as any[]).map((m) => (
                                <tr className="even:bg-[rgb(240,240,250)]">
                                    <td className="p-1">{m.nombre}</td>
                                    <td className="p-1">{m.codigo}</td>
                                    <td className="p-1"> {fueroPretty(parseInt(m.fuero_id))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
