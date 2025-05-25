import AnimatedTitle from '@/components/AnimatedTitle';
import { formatArPrice } from '@/lib/utils';
import { useState } from 'react';

export const Punitivos = () => {
    // Math.floor(C * ( (1 - PC) / (PC * PD)))
    const [capital, setCapital] = useState('');
    const [pc, setPc] = useState('');
    const [pd, setPd] = useState('');

    const computedPc = parseInt(pc) / 100;
    const computedPd = parseInt(pd) / 100;

    const resultado = capital && pc && pd && Math.floor(parseInt(capital) * (1 - computedPc)) / (computedPc * computedPd);

    return (
        <div>
            <AnimatedTitle title="Calculadora de Daños Punitivos" />
            <div className="generic-calculator-form">
                <div>
                    Capital :
                    <input type="text" className="number-input" value={capital} onChange={(e) => setCapital(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div>
                    Probabilidad de ser condenado por indemnizacion compensatoria
                    <input type="text" className="number-input" value={pc} onChange={(e) => setPc(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div>
                    Probabilidad de ser condenado por daños punitivos
                    <input type="text" className="number-input" value={pd} onChange={(e) => setPd(e.target.value.replace(/\D/g, ''))} />
                </div>

                {resultado && (
                    <div className="result-wrapper">
                        <div>Capital : {formatArPrice(parseInt(capital))}</div>
                        <div>Prob. condenado por indem. comp. : {pc} %</div>
                        <div>Prob. condenado por daños punitivos : {pd} %</div>
                        <div className="final-result">Resultado: {formatArPrice(resultado)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Punitivos;
