import AnimatedTitle from '@/components/AnimatedTitle';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { formatArPrice, mesPretty, priceWithDots } from '@/lib/utils';
import { useState } from 'react';

const variaciones: Record<string, number> = {
    '2017/01': 1.3,
    '2017/02': 2.5,
    '2017/03': 2.4,
    '2017/04': 2.6,
    '2017/05': 1.3,
    '2017/06': 1.2,
    '2017/07': 1.7,
    '2017/08': 1.4,
    '2017/09': 1.9,
    '2017/10': 1.5,
    '2017/11': 1.4,
    '2017/12': 3.1,
    '2018/01': 1.8,
    '2018/02': 2.4,
    '2018/03': 2.3,
    '2018/04': 2.7,
    '2018/05': 2.1,
    '2018/06': 3.7,
    '2018/07': 3.1,
    '2018/08': 3.9,
    '2018/09': 6.5,
    '2018/10': 5.4,
    '2018/11': 3.2,
    '2018/12': 2.6,
    '2019/01': 2.9,
    '2019/02': 3.8,
    '2019/03': 4.7,
    '2019/04': 3.4,
    '2019/05': 3.1,
    '2019/06': 2.7,
    '2019/07': 2.2,
    '2019/08': 4.0,
    '2019/09': 5.9,
    '2019/10': 3.3,
    '2019/11': 4.3,
    '2019/12': 3.7,
    '2020/01': 2.3,
    '2020/02': 2.0,
    '2020/03': 3.3,
    '2020/04': 1.5,
    '2020/05': 1.5,
    '2020/06': 2.2,
    '2020/07': 1.9,
    '2020/08': 2.7,
    '2020/09': 2.8,
    '2020/10': 3.8,
    '2020/11': 3.2,
    '2020/12': 4.0,
    '2021/01': 4.0,
    '2021/02': 3.6,
    '2021/03': 4.8,
    '2021/04': 4.1,
    '2021/05': 3.3,
    '2021/06': 3.2,
    '2021/07': 3.0,
    '2021/08': 2.5,
    '2021/09': 3.5,
    '2021/10': 3.5,
    '2021/11': 2.5,
    '2021/12': 3.8,
    '2022/01': 3.9,
    '2022/02': 4.7,
    '2022/03': 6.7,
    '2022/04': 6.0,
    '2022/05': 5.1,
    '2022/06': 5.3,
    '2022/07': 7.4,
    '2022/08': 7.0,
    '2022/09': 6.2,
    '2022/10': 6.3,
    '2022/11': 4.9,
    '2022/12': 5.1,
    '2023/01': 6.0,
    '2023/02': 6.6,
    '2023/03': 7.7,
    '2023/04': 8.4,
    '2023/05': 7.8,
    '2023/06': 6.0,
    '2023/07': 6.3,
    '2023/08': 12.4,
    '2023/09': 12.7,
    '2023/10': 8.3,
    '2023/11': 12.8,
    '2023/12': 25.5,
    '2024/01': 20.6,
    '2024/02': 13.2,
    '2024/03': 10.9,
    '2024/04': 8.8,
    '2024/05': 4.2,
    '2024/06': 4.6,
    '2024/07': 4.0,
    '2024/08': 4.2,
    '2024/09': 3.5,
    '2024/10': 2.7,
    '2024/11': 2.4,
    '2024/12': 2.7,
    '2025/01': 2.2,
    '2025/02': 2.4,
    '2025/03': 3.7,
    '2025/04': 2.8,
};

const ipcMensual: Record<string, number> = {
    '2017/01': 100,
    '2017/02': 101.3,
    '2017/03': 103.83,
    '2017/04': 106.32,
    '2017/05': 109.09,
    '2017/06': 110.51,
    '2017/07': 111.83,
    '2017/08': 113.73,
    '2017/09': 115.33,
    '2017/10': 117.52,
    '2017/11': 119.28,
    '2017/12': 120.95,
    '2018/01': 124.7,
    '2018/02': 126.94,
    '2018/03': 129.99,
    '2018/04': 132.98,
    '2018/05': 136.57,
    '2018/06': 139.44,
    '2018/07': 144.6,
    '2018/08': 149.08,
    '2018/09': 154.9,
    '2018/10': 164.96,
    '2018/11': 173.87,
    '2018/12': 179.44,
    '2019/01': 184.1,
    '2019/02': 189.44,
    '2019/03': 196.64,
    '2019/04': 205.88,
    '2019/05': 212.88,
    '2019/06': 219.48,
    '2019/07': 225.41,
    '2019/08': 230.36,
    '2019/09': 239.58,
    '2019/10': 253.71,
    '2019/11': 262.09,
    '2019/12': 273.36,
    '2020/01': 283.47,
    '2020/02': 289.99,
    '2020/03': 295.79,
    '2020/04': 305.55,
    '2020/05': 310.14,
    '2020/06': 314.79,
    '2020/07': 321.71,
    '2020/08': 327.83,
    '2020/09': 336.68,
    '2020/10': 346.1,
    '2020/11': 359.26,
    '2020/12': 370.75,
    '2021/01': 385.58,
    '2021/02': 401,
    '2021/03': 415.44,
    '2021/04': 435.38,
    '2021/05': 453.23,
    '2021/06': 468.19,
    '2021/07': 483.17,
    '2021/08': 497.67,
    '2021/09': 510.11,
    '2021/10': 527.96,
    '2021/11': 546.44,
    '2021/12': 560.1,
    '2022/01': 581.39,
    '2022/02': 604.06,
    '2022/03': 632.45,
    '2022/04': 674.82,
    '2022/05': 715.31,
    '2022/06': 751.79,
    '2022/07': 791.64,
    '2022/08': 850.22,
    '2022/09': 909.74,
    '2022/10': 966.14,
    '2022/11': 1027.01,
    '2022/12': 1077.33,
    '2023/01': 1132.27,
    '2023/02': 1200.21,
    '2023/03': 1279.43,
    '2023/04': 1377.94,
    '2023/05': 1493.69,
    '2023/06': 1610.2,
    '2023/07': 1706.81,
    '2023/08': 1814.34,
    '2023/09': 2039.31,
    '2023/10': 2298.31,
    '2023/11': 2489.07,
    '2023/12': 2807.67,
    '2024/01': 3523.62,
    '2024/02': 4249.49,
    '2024/03': 4810.42,
    '2024/04': 5334.76,
    '2024/05': 5804.21,
    '2024/06': 6047.99,
    '2024/07': 6326.2,
    '2024/08': 6579.25,
    '2024/09': 6855.58,
    '2024/10': 7095.52,
    '2024/11': 7287.1,
    '2024/12': 7461.99,
    '2025/01': 7663.46,
    '2025/02': 7832.06,
    '2025/03': 8020.03,
    '2025/04': 8316.77,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calcularIndicesDesdeVariaciones(variacionesObj: any, base = 100) {
    const keys = Object.keys(variacionesObj).sort(); // Asegura orden cronológico
    const indices: any = {};
    let valor = base;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        indices[key] = parseFloat(valor.toFixed(2));
        valor *= 1 + variacionesObj[key] / 100;
    }

    return indices;
}

//console.log(JSON.stringify(calcularIndicesDesdeVariaciones(variaciones)));

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
