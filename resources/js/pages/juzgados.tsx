import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Juzgados',
        href: '/dashboard',
    },
];

export default function Juzgados() {
    const { juzgados } = usePage().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Juzgados" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <HeadingSmall title="Lista de Juzgados" />

                    <Button variant="outline">Agregar Juzgado</Button>

                    <table className="m-3">
                        <thead>
                            <th>Nombre</th>
                        </thead>
                        <tbody>
                            {(juzgados as any[]).map((j) => (
                                <tr>
                                    <td>{j.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
