import AnimatedTitle from '@/components/AnimatedTitle';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { useState } from 'react';

export const VelocidadesMaximas = () => {
    const [data, setData] = useState({
        velocidad: '',
        medida: '',
    });
    const [isMenores, setMenores] = useState(true);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value.replace(/\D/g, ''),
        }));
    };

    const selectHandler = (e: any) => {
        const selected = e.target.value;
        setMenores(selected === 'menores');
        setData({ velocidad: '', medida: '' });
    };

    const tenPercent = parseFloat((parseInt(data.velocidad) * 0.1).toFixed(1));
    const threePercent = parseFloat((parseInt(data.velocidad) * 0.03).toFixed(1));
    const max = isMenores ? parseFloat(data.velocidad) + tenPercent + 3 : parseFloat(data.velocidad) + tenPercent + threePercent;

    if (isMenores) {
        console.log(typeof tenPercent, parseFloat(data.velocidad) + tenPercent, parseFloat(data.velocidad) + tenPercent + 3);
    }

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <AnimatedTitle title="Velocidades Maximas" />
                <h2 className="subtitle">C&aacute;lculo de Velocidades para Descargos por Multas de Tr&aacute;nsito</h2>
            </div>

            <div className="which-calculator mt-4" style={{ textAlign: 'center' }}>
                <select onChange={selectHandler} style={{ width: '230px' }}>
                    <option selected value="menores">
                        Menor a 100 km/h
                    </option>
                    <option value="mayores">Mayores a 100 km/h</option>
                </select>
            </div>

            <FloatingLabelInput label="Velocidad Maxima" name="velocidad" value={data.velocidad} onChange={handleChange} />
            <FloatingLabelInput label="Velocidad Medida" name="medida" value={data.medida} onChange={handleChange} />

            {data.velocidad && (
                <div>
                    <h2 className="subtitle">Sumario</h2>
                    <div className="velocidad-sumario">
                        <div>
                            Velocidad Máxima Permitida : <span>{data.velocidad}</span> km/h
                        </div>
                        <div>
                            Velocidad Medida <span>{data.medida}</span> km/h
                        </div>
                        <div>
                            10% por violación de Máximas (Ley 24.449, art. 77, inc. n) <span>{tenPercent}</span> km/h
                        </div>
                        {isMenores && (
                            <div>
                                3 Kms/h por Error en el Cinemómetro (Resolución 753/98, INTI) <span>3</span> km/h
                            </div>
                        )}
                        {!isMenores && (
                            <div>
                                3 % por Error en el Cinemómetro (Resolución 753/98, INTI) : <span>{threePercent}</span> km/h
                            </div>
                        )}
                        <div>
                            Velocidad Máxima Permitida para Fundar en Descargo <span>{max}</span> Km/h
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VelocidadesMaximas;
