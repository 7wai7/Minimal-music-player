import "../styles/Slider.css"

interface Props {
    className?: string,
    min?: number,
    max?: number,
    step?: number,
    value: number,
    setValue: (value: number) => void | React.Dispatch<React.SetStateAction<number>>
}

function Slider({
    className,
    min = 0,
    max = 100,
    step = .01,
    value,
    setValue
}: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    };

    const calculateValue = () => {
        return (value - min) / (max - min) * 100;
    }

    const sliderStyle = {
        background: `linear-gradient(to right, var(--theme-2) 0%, var(--theme-2) ${calculateValue()}%, #333 ${calculateValue()}%, #333 100%)`,
    };

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            style={sliderStyle}
            className={className}
        />
    );
}

export default Slider;