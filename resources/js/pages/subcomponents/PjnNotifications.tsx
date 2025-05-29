/* eslint-disable react-hooks/exhaustive-deps */
import TitleWithLongLine from '@/components/TitleWithLongLine';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDashboardStore } from './DashboardStore';

export const PjnNotifications = ({ fecha }: { fecha: string }) => {
    const [fetchPjnNotifError, setFetchPjnNotifError] = useState<undefined | string>();
    const [pjnNotifications, setPjnNotifications] = useState<any>([]);

    const { loadingPjn, setLoadingPjn } = useDashboardStore();
    const [gettingNotifications, setGettingNotifications] = useState(false);

    const fetchPjn = (fecha: string) => {
        setFetchPjnNotifError('');
        setLoadingPjn(true);
        setPjnNotifications([]);
        axios
            .get('/bot/pjn/notifications?fecha=' + fecha)
            .then((response) => {
                setLoadingPjn(false);
                setPjnNotifications(response.data);
            })
            .catch((err) => {
                setLoadingPjn(false);
                console.log(err);
                setFetchPjnNotifError('No se pudo traer las notificaciones desde SCBA.');
            });
    };

    const fetchNotifications = (pjnNotif: any) => {
        setGettingNotifications(true);
        const url = `/bot/pjn/expediente?fecha=${fecha}&position=${pjnNotif.faces_position}`;
        axios.get(url).then((response) => {
            setGettingNotifications(false);
            pjnNotif.details = response.data;
        });
    };

    useEffect(() => {
        if (fecha) fetchPjn(fecha);
    }, [fecha]);

    return (
        <div>
            <TitleWithLongLine title="P.J.N." className="mt-8 mb-4" />
            {fetchPjnNotifError && <div> {fetchPjnNotifError} </div>}
            {pjnNotifications && (
                <div>
                    {pjnNotifications.map((pjnNotif: any) => (
                        <div className="notif-slot pjn">
                            <div className="expediente">Expediente: {pjnNotif.expediente}</div>
                            <div className="caratula">Caratula: {pjnNotif.caratula}</div>
                            <div className="dependencia">Dependencia: {pjnNotif.dependencia}</div>
                            <div className="situacion">Situacion: {pjnNotif.situacion}</div>
                            <div className="ult-actualizacion">Ult. Actualizacion: {pjnNotif.ultimaActualizacion}</div>
                            {!pjnNotif.details && (
                                <div>
                                    <input
                                        type="button"
                                        className="small-button"
                                        value="Ver Notificaciones"
                                        disabled={gettingNotifications}
                                        onClick={() => fetchNotifications(pjnNotif)}
                                    />
                                </div>
                            )}
                            {pjnNotif.details && (
                                <div className="pjn-notification-details">
                                    {pjnNotif.details.map((detail: any) => (
                                        <div className="pjn-notification">
                                            <div>
                                                <span>Fecha:</span> <span>{detail.Fecha}</span>
                                            </div>
                                            <div>
                                                <span>Tipo:</span> <span>{detail.Tipo}</span>
                                            </div>
                                            <div>
                                                <span>Descripcion:</span> <span>{detail.Descripcion}</span>
                                            </div>
                                            <div>
                                                <span>Oficina:</span> <span>{detail.Oficina}</span>
                                            </div>
                                            {detail.link && (
                                                <div>
                                                    <input
                                                        type="button"
                                                        className="small-button"
                                                        value="Descargar"
                                                        onClick={() => (window.location.href = detail.link)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {loadingPjn && <div>Cargando...</div>}
            {fecha && pjnNotifications.length === 0 && !fetchPjnNotifError && !loadingPjn && <div>No hay notificaciones PJN</div>}
        </div>
    );
};

export default PjnNotifications;
