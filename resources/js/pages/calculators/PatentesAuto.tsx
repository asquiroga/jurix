import AnimatedTitle from '@/components/AnimatedTitle';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { useState } from 'react';

const yearFrom6digits = (patente: string) => {
    const peso = patente.substring(0, 2);
    if (peso < 'AP') return 1995;
    if (peso < 'BD') return 1996;
    if (peso < 'BU') return 1997;
    if (peso < 'CM') return 1998;
    if (peso < 'DC') return 1999;
    if (peso < 'DO') return 2000;
    if (peso < 'DX') return 2001;
    if (peso < 'ED') return 2002;
    if (peso < 'EI') return 2003;
    if (peso < 'ET') return 2004;
    if (peso < 'FI') return 2005;
    if (peso < 'GB') return 2006;
    if (peso < 'GV') return 2007;
    if (peso < 'HT') return 2008;
    if (peso < 'IM') return 2009;
    if (peso < 'JN') return 2010;
    if (peso < 'KU') return 2011;
    if (peso < 'MB') return 2012;
    if (peso < 'NM') return 2013;
    if (peso < 'ON') return 2014;
    if (peso < 'PM') return 2015;
    return 2016;
};

const sevenDigsMap: Record<string, string> = {
    'AH-236-AA': 'Abril 2025',
    'AH-000-AA': 'Diciembre 2024',
    'AG-650-AA': 'Junio 2024',
    'AG-450-AA': 'Enero 2024',
    'AG-300-AA': 'Octubre 2023',
    'AG-000-AA': 'Mayo 2023',
    'AF-800-AA': 'Enero 2023',
    'AF-600-AA': 'Octubre 2022',
    'AF-150-AA': 'Enero 2022',
    'AF-000-AA': 'Agosto 2021',
    'AE-600-AA': 'Enero 2021',
    'AE-100-AA': 'Enero 2020',
    'AE-000-AA': 'Octubre 2019',
    'AD-400-AA': 'Enero 2019',
    'AD-000-AA': 'Julio 2018',
    'AC-200-AA': 'Enero 2018',
    'AC-000-AA': 'Noviembre 2017',
    'AB-000-AA': 'Febrero 2017',
    'AA-900-AA': 'Enero 2017',
    'AA-000-AA': 'Abril 2016',
};
const yearFrom7digits = (patente: string) => {
    const keys = Object.keys(sevenDigsMap).sort().reverse();
    let result: string = '';
    keys.find((aKey) => {
        if (patente > aKey) {
            result = sevenDigsMap[aKey];
            return true;
        }
        return false;
    });
    return result;
};

const PatentesAuto = () => {
    const [inicializado, setInicializado] = useState(false);
    const [es6dig, setEs6dig] = useState(false);

    const [patente, setPatente] = useState('');

    const handle6dig = (e: any) => {
        let input = e.target.value.toUpperCase(); // Mayúsculas
        input = input.replace(/[^A-Z0-9]/g, ''); // Solo letras y números

        // Separar letras y números
        const letras = input.slice(0, 3).replace(/[^A-Z]/g, '');
        const numeros = input.slice(3, 6).replace(/\D/g, '');
        let formateado = letras;

        if (numeros.length > 0) {
            formateado += '-' + numeros;
        }

        setPatente(formateado);
    };

    const handle7dig = (e: any) => {
        let input = e.target.value.toUpperCase(); // Convertir a mayúsculas
        input = input.replace(/[^A-Z0-9]/g, ''); // Eliminar no letras/números

        const letras1 = input.slice(0, 2).replace(/[^A-Z]/g, '');
        const numeros = input.slice(2, 5).replace(/\D/g, '');
        const letras2 = input.slice(5, 7).replace(/[^A-Z]/g, '');

        let formateado = letras1;
        if (numeros.length > 0) formateado += '-' + numeros;
        if (letras2.length > 0) formateado += '-' + letras2;
        setPatente(formateado);
    };

    return (
        <div className="patentes-auto-calculator">
            <AnimatedTitle title="Calculadora de año de automotor" />

            <div>Seleccione el tipo de patente:</div>
            <div>
                <input
                    type="button"
                    value="ABC-123"
                    className="small-button"
                    onClick={() => {
                        setInicializado(true);
                        setEs6dig(true);
                        setPatente('');
                    }}
                />
                <input
                    type="button"
                    value="AA-123-AA"
                    className="small-button"
                    onClick={() => {
                        setInicializado(true);
                        setEs6dig(false);
                        setPatente('');
                    }}
                />
            </div>
            {inicializado && es6dig && (
                <>
                    <div>
                        <FloatingLabelInput label="Patente ABC-123" id="patente-6-dig" value={patente} onChange={handle6dig} />
                    </div>
                    {patente.length > 2 && <div>A&ntilde;o: {yearFrom6digits(patente)}</div>}
                </>
            )}

            {inicializado && !es6dig && (
                <>
                    <div>
                        <FloatingLabelInput label="Patente AA-123-AA" id="patente-7-dig" value={patente} onChange={handle7dig} />
                    </div>
                    {patente.length === 9 && yearFrom7digits(patente)}
                </>
            )}
        </div>
    );
};

export default PatentesAuto;
