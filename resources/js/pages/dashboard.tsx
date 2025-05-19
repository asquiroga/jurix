import AppLayout from '@/layouts/app-layout';
import { clientSideDownload } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Inicial',
        href: '/dashboard',
    },
];

const fechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

export default function Dashboard() {
    const [fecha, setFecha] = useState<string>(fechaActual());
    const [fetchingScba, setFetchingScba] = useState<boolean>(false);
    const [scbaNotifications, setScbaNotifications] = useState<any>([]);
    const [fetchScbaNotifError, setFetchScbaNotifError] = useState<undefined | string>();
    const [gettingPdf, setGettingPdf] = useState(false);

    const [fetchingPjn, setFetchingPjn] = useState<boolean>(false);
    const [fetchPjnNotifError, setFetchPjnNotifError] = useState<undefined | string>();
    const [pjnNotifications, setPjnNotifications] = useState<any>([]);

    const downloadPDF = async (notification: any) => {
        setGettingPdf(true);
        const completeBody = notification.body;
        const head: string = `
            <style>  
                label { font-weight: bold; }
                .body { margin-top: 2em; }
            </style>
        `;
        const body: string = `
                <div class="fecha"><label>FECHA:</label> ${notification?.AltaoDisponibilidad} </div>
                <div class="organismo"><label>ORGANISMO:</label> ${notification?.Organismo} </div>
                <div class="caratula"><label>CARATULA:</label> ${notification?.Caratula?.text} </div>
                <div class="tramite"><label>TRAMITE:</label> ${notification?.Tramite} </div>
                
                <div class="body"> ${completeBody}</div>
        `;
        const response = await fetch('/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content,
            },
            body: JSON.stringify({
                title: 'Notificacion',
                head,
                body,
            }),
        });

        setGettingPdf(false);
        if (!response.ok) {
            console.error('Error al generar el PDF');
            return;
        }

        const blob = await response.blob();
        clientSideDownload(blob, 'Notificacion.pdf');
    };

    const fetchAll = () => {
        fetchScba();
        fetchPjn();
    };

    const fetchPjn = () => {
        setFetchingPjn(true);
        axios
            .get('/bot/pjn-notifications?fecha=' + fecha)
            .then((response) => {
                setFetchingPjn(false);
                setPjnNotifications(response.data);
            })
            .catch((err) => {
                setFetchingPjn(false);
                console.log(err);
                setFetchPjnNotifError('No se pudo traer las notificaciones desde SCBA.');
            });
    };

    const fetchScba = () => {
        setFetchingScba(true);
        axios
            .get('/bot/scba-notifications?fecha=' + fecha)
            .then((response) => {
                setFetchingScba(false);
                setScbaNotifications(response.data);
            })
            .catch((err) => {
                setFetchingScba(false);
                console.log(err);
                setFetchScbaNotifError('No se pudo traer las notificaciones desde SCBA.');
            });
    };

    const viewNotification = (notification: any) => {
        setFetchingScba(true);
        notification.loading = true;
        axios
            .get('/bot/scba-get-notification?url=' + notification.Caratula.link)
            .then((response) => {
                notification.body = response.data;
                console.log(notification.body);
            })
            .catch((err) => {
                console.log(err);
                notification.error = 'Problema recuperando la notificacion!';
            })
            .finally(() => {
                setFetchingScba(false);
                notification.loading = false;
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-3 md:min-h-min">
                    <div className="m-2 mt-5">
                        Notificaciones para el dia:
                        <input
                            type="text"
                            className="w-[110px] border border-black p-1"
                            maxLength={10}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                        <input type="button" value="Consultar" className="button m-2" disabled={fetchingScba} onClick={fetchAll} />
                        <div>
                            <h2 className="titulo-animado">SCBA</h2>
                            {fetchScbaNotifError && <div> {fetchScbaNotifError} </div>}
                            {scbaNotifications && (
                                <div>
                                    {scbaNotifications.map((notif: any) => (
                                        <div className="notif-slot">
                                            <div className="fecha">{notif?.AltaoDisponibilidad} </div>
                                            <div className="organismo">{notif?.Organismo} </div>
                                            <div className="caratula">{notif?.Caratula?.text} </div>
                                            <div className="tramite">{notif?.Tramite} </div>

                                            {!notif.body && (
                                                <div className="mt-4 flex items-center space-x-2">
                                                    <input
                                                        type="button"
                                                        value="Ver Notificacion"
                                                        className="small-button"
                                                        disabled={fetchingScba}
                                                        onClick={() => viewNotification(notif)}
                                                    />
                                                    {fetchingScba && notif.loading && <LoaderCircle className="animate-spin" />}
                                                    {notif.error && <div className="one-notif-error">{notif.error}</div>}
                                                </div>
                                            )}
                                            {notif?.body && (
                                                <div className="notif-body">
                                                    <div dangerouslySetInnerHTML={{ __html: notif.body }} />

                                                    <input
                                                        type="button"
                                                        value="PDF"
                                                        disabled={gettingPdf}
                                                        className="small-button"
                                                        onClick={(e) => {
                                                            downloadPDF(notif);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {scbaNotifications.length === 0 && !fetchScbaNotifError && !fetchingScba && <div>No hay notificaciones SCBA</div>}

                            <h2 className="titulo-animado">PJN</h2>
                            {fetchPjnNotifError && <div> {fetchPjnNotifError} </div>}
                            {pjnNotifications && (
                                <div>
                                    {pjnNotifications.map((pjnNotif: any) => (
                                        <div className="notif-slot">
                                            <div>Expediente: {pjnNotif.expediente}</div>
                                            <div>Dependencia: {pjnNotif.dependencia}</div>
                                            <div>Situacion: {pjnNotif.situacion}</div>
                                            <div>Ult. Actualizacion: {pjnNotif.ultimaActualizacion}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {pjnNotifications.length === 0 && !fetchPjnNotifError && !fetchingPjn && <div>No hay notificaciones TJN</div>}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
