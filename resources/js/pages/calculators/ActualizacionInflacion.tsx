import AnimatedTitle from '@/components/AnimatedTitle';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { formatArPrice, mesPretty, priceWithDots } from '@/lib/utils';
import { useState } from 'react';

const ipcMensual: Record<string, number> = {
    '2017/01': 100,
    '2017/02': 102.5,
    '2017/03': 106.1,
    '2017/04': 108.4,
    '2017/05': 110.8,
    '2017/06': 112.9,
    '2017/07': 115.1,
    '2017/08': 117.8,
    '2017/09': 120.2,
    '2017/10': 123.0,
    '2017/11': 126.6,
    '2017/12': 130.9,
    '2018/01': 134.9,
    '2018/02': 138.5,
    '2018/03': 143.7,
    '2018/04': 150.3,
    '2018/05': 156.6,
    '2018/06': 163.3,
    '2018/07': 169.9,
    '2018/08': 180.1,
    '2018/09': 192.9,
    '2018/10': 206.7,
    '2018/11': 213.6,
    '2018/12': 219.9,
    '2019/01': 225.6,
    '2019/02': 232.7,
    '2019/03': 242.9,
    '2019/04': 252.5,
    '2019/05': 260.6,
    '2019/06': 266.1,
    '2019/07': 274.3,
    '2019/08': 289.6,
    '2019/09': 301.5,
    '2019/10': 312.9,
    '2019/11': 319.9,
    '2019/12': 328.5,
    '2020/01': 335.2,
    '2020/02': 341.5,
    '2020/03': 349.1,
    '2020/04': 351.8,
    '2020/05': 355.9,
    '2020/06': 360.4,
    '2020/07': 366.7,
    '2020/08': 373.0,
    '2020/09': 381.6,
    '2020/10': 391.1,
    '2020/11': 401.8,
    '2020/12': 413.9,
    '2021/01': 424.3,
    '2021/02': 435.8,
    '2021/03': 451.8,
    '2021/04': 467.3,
    '2021/05': 480.4,
    '2021/06': 493.2,
    '2021/07': 505.5,
    '2021/08': 518.8,
    '2021/09': 529.9,
    '2021/10': 540.5,
    '2021/11': 551.3,
    '2021/12': 566.2,
    '2022/01': 585.7,
    '2022/02': 608.9,
    '2022/03': 641.3,
    '2022/04': 669.8,
    '2022/05': 696.7,
    '2022/06': 734.1,
    '2022/07': 782.3,
    '2022/08': 828.4,
    '2022/09': 875.2,
    '2022/10': 925.1,
    '2022/11': 970.7,
    '2022/12': 1017.3,
    '2023/01': 1073.2,
    '2023/02': 1133.0,
    '2023/03': 1205.4,
    '2023/04': 1294.9,
    '2023/05': 1367.1,
    '2023/06': 1440.8,
    '2023/07': 1526.0,
    '2023/08': 1717.8,
    '2023/09': 1875.3,
    '2023/10': 2045.4,
    '2023/11': 2200.2,
    '2023/12': 2484.2,
    '2024/01': 2795.5,
    '2024/02': 3020.5,
    '2024/03': 3330.3,
    '2024/04': 3423.6,
    '2024/12': 2484.2,
    '2025/01': 2551.3,
    '2025/02': 2615.1,
    '2025/03': 2711.9,
    '2025/04': 2787.8,
};

const calcular = (monto: number, desde: string, hasta: string) => {
    if (ipcMensual[desde] === undefined) return ['', 'No se tiene registro para la fecha ' + desde];
    if (ipcMensual[hasta] === undefined) return ['', 'No se tiene registro para la fecha ' + hasta];

    const final = (monto * (ipcMensual[hasta] / ipcMensual[desde])).toFixed(2);
    const variacion = ((ipcMensual[hasta] / ipcMensual[desde] - 1) * 100).toFixed(1);

    return [`${variacion} %`, formatArPrice(parseFloat(final))];
};
export const ActualizacionInflacion = () => {
    const [data, setData] = useState({
        monto: '',
        desde: '',
        hasta: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        let v: string = value;

        if (name === 'monto') v = value.replace(/\D/g, '');

        if (name === 'desde' || name === 'hasta') {
            v = value.replace(/[^\d]/g, '');
            if (v.length > 6) v = v.slice(0, 6);

            const year = v.slice(0, 4);
            let month = v.slice(4, 6);
            if (month.length === 2) {
                const monthNum = parseInt(month, 10);
                if (monthNum < 1 || monthNum > 12) {
                    month = '';
                } else {
                    month = monthNum.toString().padStart(2, '0');
                }
            }
            v = [year, month].filter(Boolean).join('/');
        }

        setData((prev) => ({
            ...prev,
            [name]: v,
        }));
    };

    const showResult = data.monto && data.desde.length === 7 && data.hasta.length === 7;

    let inflacion;
    if (showResult) {
        inflacion = calcular(parseInt(data.monto), data.desde, data.hasta);
    }

    return (
        <div>
            <AnimatedTitle title="Actualizacion por inflaci&oacute;n" />

            <FloatingLabelInput value={priceWithDots(data.monto)} label="Ingrese el monto" leftSign="$" name="monto" onChange={handleChange} />

            <div style={{ textAlign: 'center' }}>Para las fechas debe ingresarlas en este formato: 2024/01 (Enero de 2024)</div>
            <FloatingLabelInput value={data.desde} label="Desde (A&ntilde;o/Mes)" name="desde" onChange={handleChange} />
            <FloatingLabelInput value={data.hasta} label="Hasta (A&ntilde;o/Mes)" name="hasta" onChange={handleChange} />

            {showResult && (
                <div className="inflacion-result mt-10">
                    <div>
                        Monto Inicial: <span>{formatArPrice(parseInt(data.monto))}</span>
                    </div>
                    <div>
                        Mes Inicial: <span>{mesPretty(data.desde)}</span>
                    </div>
                    <div>
                        Mes Final: <span>{mesPretty(data.hasta)}</span>
                    </div>
                    <div>
                        Variacion: <span>{inflacion?.[0]}</span>
                    </div>
                    <div className="final-result mt-4">
                        Monto Final: <span> {inflacion?.[1]} </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActualizacionInflacion;
