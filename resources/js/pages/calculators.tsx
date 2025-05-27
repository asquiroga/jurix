import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { JSX, useState } from 'react';
import '../../css/calculator.css';
import ActualizacionInflacion from './calculators/ActualizacionInflacion';
import IusCalculator from './calculators/IusCalculator';
import PatentesAuto from './calculators/PatentesAuto';
import Punitivos from './calculators/Punitivos';
import VelocidadesMaximas from './calculators/VelocidadesMaximas';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calculadora',
        href: '/calculator',
    },
];

const componentMap: Record<string, JSX.Element> = {
    ius: <IusCalculator />,
    punitivos: <Punitivos />,
    patenteAutomotor: <PatentesAuto />,
    velocidadesMaximas: <VelocidadesMaximas />,
    actualizacionInflacion: <ActualizacionInflacion />,
};

export default function Calculadora() {
    const [opcion, setOpcion] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calculadoras" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="calculator-wrapper">
                        <div className="which-calculator mb-4" style={{ textAlign: 'center' }}>
                            Seleccione la calculadora:
                            <select onChange={(e) => setOpcion(e.target.value)}>
                                <option selected value="">
                                    Seleccione...
                                </option>
                                <option value="ius">IUS</option>
                                <option value="punitivos">Da&ntilde;os Punitivos</option>
                                <option value="patenteAutomotor">Año de Automotor por patente</option>
                                <option value="velocidadesMaximas">Velocidades Maximas (Automotor)</option>
                                <option value="actualizacionInflacion">Actualizacion por Inflacion</option>
                            </select>
                        </div>
                        <div className="current-calculator mx-auto sm:max-w-[400px] lg:max-w-[800px]">{opcion && componentMap[opcion]}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
