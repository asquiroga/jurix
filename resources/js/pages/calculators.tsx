import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { JSX, useState } from 'react';
import '../../css/calculator.css';
import IusCalculator from './calculators/IusCalculator';
import Punitivos from './calculators/Punitivos';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calculadora',
        href: '/calculator',
    },
];

const componentMap: Record<string, JSX.Element> = {
    ius: <IusCalculator />,
    punitivos: <Punitivos />,
};

export default function Calculadora() {
    const [opcion, setOpcion] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calculadoras" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="calculator-wrapper">
                        <div className="which-calculator">
                            Seleccione la calculadora:
                            <select onChange={(e) => setOpcion(e.target.value)}>
                                <option selected value="">
                                    Seleccione...
                                </option>
                                <option value="ius">IUS</option>
                                <option value="punitivos">Punitivos</option>
                            </select>
                        </div>
                        <div className="current-calculator">{opcion && componentMap[opcion]}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
