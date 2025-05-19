/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDashboardStore } from './DashboardStore';

export const PjnNotifications = ({ fecha }: { fecha: string }) => {
    const [fetchPjnNotifError, setFetchPjnNotifError] = useState<undefined | string>();
    const [pjnNotifications, setPjnNotifications] = useState<any>([]);

    const { loadingPjn, setLoadingPjn } = useDashboardStore();

    const fetchPjn = (fecha: string) => {
        setLoadingPjn(true);
        setPjnNotifications([]);
        axios
            .get('/bot/pjn-notifications?fecha=' + fecha)
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

    useEffect(() => {
        if (fecha) fetchPjn(fecha);
    }, [fecha]);

    return (
        <div>
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

            {loadingPjn && <div>Cargando...</div>}
            {fecha && pjnNotifications.length === 0 && !fetchPjnNotifError && !loadingPjn && <div>No hay notificaciones TJN</div>}
        </div>
    );
};

export default PjnNotifications;
