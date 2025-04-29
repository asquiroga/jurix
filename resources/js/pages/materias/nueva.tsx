import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { fuerosOptions } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Materias',
        href: '/materias',
    },
    {
        title: 'Nueva Materia',
        href: '/materias/nueva',
    },
];

export default function () {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        fuero: '1',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Materia" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <HeadingSmall title="Nueva Materia" />

                    <Head title="Nueva Materia" />

                    <form
                        className="flex flex-col gap-6"
                        onSubmit={() => {
                            post('/materias/store');
                        }}
                    >
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Nombre</Label>
                                <Input
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Nombre de la nueva materia"
                                />
                                <InputError message={errors.nombre} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Fuero</Label>
                                <select className="border-blue border" onChange={(e) => setData('fuero', e.target.value)}>
                                    {fuerosOptions.map((o) => (
                                        <option value={o.value}>{o.text}</option>
                                    ))}
                                </select>
                                <InputError message={errors.fuero} />
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={false}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
