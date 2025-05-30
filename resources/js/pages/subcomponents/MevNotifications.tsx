import TitleWithLongLine from '@/components/TitleWithLongLine';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDashboardStore } from './DashboardStore';

const MevNotifications = ({ fecha }: { fecha: string }) => {
    const [mevNotifications, setMevNotifications] = useState<any>([]);
    const [fetchMevError, setFetchMevError] = useState<undefined | string>();

    const { loadingMev, setLoadingMev } = useDashboardStore();

    const fetchMevNotifications = (fecha: string) => {
        setFetchMevError('');
        setMevNotifications([]);
        setLoadingMev(true);
        axios
            .get('/bot/mev/notifications?fecha=' + fecha)
            .then((response) => {
                setLoadingMev(false);
                setMevNotifications(response.data.data);
            })
            .catch((err) => {
                setLoadingMev(false);
                console.log(err);
                setFetchMevError('No se pudo traer las notificaciones desde MEV.');
            });
    };

    useEffect(() => {
        if (fecha) fetchMevNotifications(fecha);
    }, [fecha]);

    return (
        <div>
            <TitleWithLongLine title="M.E.V." className="mt-8 mb-4" />
            {fetchMevError && <div> {fetchMevError} </div>}
            {mevNotifications && (
                <div>
                    {mevNotifications.map((mevNotification: any) => (
                        <div className="notif-slot mev">
                            <div className="caratula">{mevNotification?.Caratula} </div>
                            <div className="pasoConFecha">{mevNotification?.PasoConFecha} </div>
                            <div className="estado">{mevNotification?.Estado} </div>
                            <div className="idExpte">
                                Identificador: <span>{mevNotification?.IdExpediente} </span>
                            </div>

                            <div className="Organismo"></div>
                        </div>
                    ))}
                </div>
            )}
            {loadingMev && <div>Cargando...</div>}
        </div>
    );
};

export default MevNotifications;
