import AnimatedTitle from '@/components/AnimatedTitle';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import AppLayout from '@/layouts/app-layout';
import { buildQueryString } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documentos',
        href: '/documents',
    },
];

export const Documents = () => {
    const [dias, setDias] = useState('');
    const [mes, setMes] = useState('');
    const [nombre, setNombre] = useState('');
    const [nacimiento, setNacimiento] = useState('');
    const [dni, setDni] = useState('');
    const [domicilioReal, setDomicilioReal] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [provincia, setProvincia] = useState('');

    const downloadHandler = () => {
        const params = {
            template: 'poder.docx',
            dias,
            mes,
            nombreCompleto: nombre,
            nacimiento,
            dni,
            domicilioReal,
            localidad,
            provincia,
        };

        window.location.href = `/documents/instantiate?${buildQueryString(params)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documentos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div>
                        <AnimatedTitle title="Creacion de Documentos" />
                    </div>

                    <div>[ Prueba con Planilla de PODER ]</div>

                    <div>
                        <FloatingLabelInput
                            label="Dias"
                            value={dias}
                            onChange={(e: any) => setDias(e.target.value.replace(/\D/g, ''))}
                            id="doc-dias"
                        />
                    </div>
                    <div>
                        <FloatingLabelInput label="Mes" value={mes} onChange={(e: any) => setMes(e.target.value)} id="doc-dias" />
                    </div>
                    <div>
                        <FloatingLabelInput label="Nombre Completo" value={nombre} onChange={(e: any) => setNombre(e.target.value)} id="doc-dias" />
                    </div>
                    <div>
                        <FloatingLabelInput
                            label="Nacimiento"
                            value={nacimiento}
                            onChange={(e: any) => setNacimiento(e.target.value)}
                            id="doc-dias"
                        />
                    </div>
                    <div>
                        <FloatingLabelInput label="DNI" value={dni} onChange={(e: any) => setDni(e.target.value)} id="doc-dias" />
                    </div>
                    <div>
                        <FloatingLabelInput
                            label="Domicilio Real"
                            value={domicilioReal}
                            onChange={(e: any) => setDomicilioReal(e.target.value)}
                            id="doc-dias"
                        />
                    </div>
                    <div>
                        <FloatingLabelInput label="Localidad" value={localidad} onChange={(e: any) => setLocalidad(e.target.value)} id="doc-dias" />
                    </div>
                    <div>
                        <FloatingLabelInput label="Provincia" value={provincia} onChange={(e: any) => setProvincia(e.target.value)} id="doc-dias" />
                    </div>

                    <input type="button" value="Descargar" className="small-button" onClick={downloadHandler} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Documents;
