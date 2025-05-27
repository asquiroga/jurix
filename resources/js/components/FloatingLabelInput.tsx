import '../../css/floatingLabelInput.css';
type FloatingLabelProps = {
    label: string;
    id?: string;
    value: string;
    onChange: any;
    type?: string;
    leftSign?: string;
    name?: string;
};
export default function FloatingLabelInput({ label, id, type = 'text', value, onChange, leftSign, name }: FloatingLabelProps) {
    const extraProps: any = {};
    if (name) {
        extraProps.name = name;
    }

    return (
        <div className={`input-group ${leftSign ? 'left-icon' : ''}`}>
            {leftSign && <span className="input-icon">{leftSign}</span>}
            <input type={type} value={value} onChange={onChange} required className={`input-field`} {...extraProps} />
            <label className="input-label">{label}</label>
        </div>
    );
}
