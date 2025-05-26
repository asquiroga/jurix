import '../../css/floatingLabelInput.css';
type FloatingLabelProps = {
    label: string;
    id: string;
    value: string;
    onChange: any;
    type?: string;
    leftSign?: string;
};
export default function FloatingLabelInput({ label, id, type = 'text', value, onChange, leftSign }: FloatingLabelProps) {
    return (
        <div className={`input-group ${leftSign ? 'left-icon' : ''}`}>
            {leftSign && <span className="input-icon">{leftSign}</span>}
            <input type={type} id={id} value={value} onChange={onChange} required className={`input-field`} />
            <label htmlFor={id} className="input-label">
                {label}
            </label>
        </div>
    );
}
