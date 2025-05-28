/* eslint-disable react-hooks/exhaustive-deps */
import { clientSideDownload } from '@/lib/utils';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDashboardStore } from './DashboardStore';

export const ScbaNotifications = ({ fecha }: { fecha: string }) => {
    const [gettingPdf, setGettingPdf] = useState(false);
    const [scbaNotifications, setScbaNotifications] = useState<any>([]);
    const [fetchNotifError, setFetchNotifError] = useState<undefined | string>();

    const { loadingScba, setLoadingScba } = useDashboardStore();

    const fetchScba = useCallback(
        (fecha: string) => {
            setLoadingScba(true);
            setScbaNotifications([]);
            axios
                .get('/bot/scba/notifications?fecha=' + fecha)
                .then((response) => {
                    setLoadingScba(false);
                    setScbaNotifications(response.data);
                })
                .catch((err) => {
                    setLoadingScba(false);
                    console.log(err);
                    setFetchNotifError('No se pudo traer las notificaciones desde SCBA.');
                });
        },
        [fecha],
    );

    useEffect(() => {
        if (fecha) fetchScba(fecha);
    }, [fecha, fetchScba]);

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

    const viewNotification = (notification: any) => {
        setLoadingScba(true);
        notification.loading = true;
        axios
            .get('/bot/scba/get-notification?url=' + notification.Caratula.link)
            .then((response) => {
                notification.body = response.data;
                console.log(notification.body);
            })
            .catch((err) => {
                console.log(err);
                notification.error = 'Problema recuperando la notificacion!';
            })
            .finally(() => {
                setLoadingScba(false);
                notification.loading = false;
            });
    };

    return (
        <div>
            <h2 className="titulo-animado">SCBA</h2>
            {fetchNotifError && <div> {fetchNotifError} </div>}
            {scbaNotifications && (
                <div>
                    {scbaNotifications.map((notif: any) => (
                        <div className="notif-slot" key={notif.Codigo}>
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
                                        disabled={loadingScba}
                                        onClick={() => viewNotification(notif)}
                                    />
                                    {loadingScba && notif.loading && <LoaderCircle className="animate-spin" />}
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
            {loadingScba && <div>Cargando...</div>}
            {fecha && scbaNotifications.length === 0 && !fetchNotifError && !loadingScba && <div>No hay notificaciones SCBA</div>}
        </div>
    );
};

export default ScbaNotifications;
