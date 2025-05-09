import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Inicial',
        href: '/dashboard',
    },
];

const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const fechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
};
export default function Dashboard() {
    const { auth, precio_ius } = usePage().props;
    const [ius, setIus] = useState<number>(NaN);
    const [fecha, setFecha] = useState<string>(fechaActual());
    const [fetching, setFetching] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<any>([]);

    const fetchScba = () => {
        setFetching(true);
        axios.get('/scba-notifications?fecha=' + fecha).then((response) => {
            setFetching(false);
            setNotifications(response.data);
        });
    };

    const viewNotification = (notification: any) => {
        setFetching(true);
        axios.get('/scba-get-notification?url=' + notification.Caratula.link).then((response) => {
            setFetching(false);
            notification.body = response.data;
        });
    };

    const precioTotal = !isNaN(ius) ? ius * parseInt(precio_ius as string) : undefined;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="m-2 border bg-[rgb(240,240,240)] p-3">
                        Precio IUS: <span className="text-[rgb(150,100,100)]">{priceFormatter.format(precio_ius as any)}</span> <br />
                        Cantidad de IUS :
                        <input
                            type="text"
                            className="w-[30px] rounded-sm border border-black bg-[rgb(220,220,220)] p-[3px]"
                            onChange={(e) => setIus(parseInt(e.target.value))}
                        />
                        {precioTotal && (
                            <span className="ml-3 border border-black p-1 text-lg font-bold"> {priceFormatter.format(precioTotal)} </span>
                        )}
                    </div>

                    <div className="m-2 mt-5">
                        Notificaciones para el dia:
                        <input
                            type="text"
                            className="w-[110px] border border-black p-1"
                            maxLength={10}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                        <input type="button" value="Consultar" className="button m-2" disabled={fetching} onClick={fetchScba} />
                        {notifications && (
                            <div>
                                {notifications.map((notif: any) => (
                                    <div className="notif-slot">
                                        <div className="fecha">{notif?.AltaoDisponibilidad} </div>
                                        <div className="organismo">{notif?.Organismo} </div>
                                        <div className="caratula">{notif?.Caratula?.text} </div>
                                        <div className="tramite">{notif?.Tramite} </div>

                                        <div className="mt-4">
                                            {!notif.body && (
                                                <input
                                                    type="button"
                                                    value="Ver Notificacion"
                                                    className="small-button"
                                                    disabled={fetching}
                                                    onClick={() => viewNotification(notif)}
                                                />
                                            )}
                                        </div>
                                        {notif?.body && (
                                            <div className="notif-body">
                                                {notif.body.map((aLine: string) => (
                                                    <div className="paragraph">{aLine}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {notifications.length === 0 && !fetching && <div>No hay notificaciones para mostrar</div>}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
