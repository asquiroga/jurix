import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import { useDashboardStore } from './subcomponents/DashboardStore';
import PjnNotifications from './subcomponents/PjnNotifications';
import ScbaNotifications from './subcomponents/ScbaNotifications';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Inicial',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [animarFecha, setAnimarFecha] = useState(false);
    const { loadingPjn, loadingScba } = useDashboardStore();

    const [selectedDate, setSelectedDate] = useState('');
    const handleDateChange = (date: any) => {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setSelectedDate(`${day}/${month}/${year}`);
        } else {
            setSelectedDate('');
        }
        setAnimarFecha(false);
        requestAnimationFrame(() => {
            setAnimarFecha(true);
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="m-2 mt-5">
                        <div className="dashboard-datepicker-wrapper">
                            <span>Seleccione el dia:</span>
                            <DatePicker
                                onChange={handleDateChange}
                                clearIcon={null}
                                format="d/M/y"
                                minDate={new Date(2025, 1, 1)}
                                className="dashboard-date-picker"
                                value={
                                    selectedDate
                                        ? new Date(
                                              Number(selectedDate.slice(6)),
                                              Number(selectedDate.slice(3, 5)) - 1,
                                              Number(selectedDate.slice(0, 2)),
                                          )
                                        : null
                                }
                                disabled={loadingPjn || loadingScba}
                            />
                        </div>
                        {selectedDate && <div className={`dashboard-date-selected fecha-animada ${animarFecha ? 'animar' : ''}`}>{selectedDate}</div>}
                        <ScbaNotifications fecha={selectedDate} />
                        <PjnNotifications fecha={selectedDate} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
