interface ToggleSwitchProps {
    className?: string;
    value: boolean;
    onChange?: (value: boolean) => void;
}

export const ToggleSwitch = ({ className, value, onChange }: ToggleSwitchProps) => {
    return (
        <div
            onClick={() => {
                if (onChange) onChange(!value);
            }}
            className={`flex h-4 w-7 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
                value ? 'bg-green-500' : 'bg-gray-400'
            } ${className ? className : ''} global-toggle-switch`}
        >
            <div
                className={`h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    value ? 'translate-x-3' : 'translate-x-0'
                }`}
            />
        </div>
    );
};

export default ToggleSwitch;
