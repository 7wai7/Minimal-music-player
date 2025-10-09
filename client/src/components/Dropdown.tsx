import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type JSX } from "react";
import "../styles/Dropdown.css"

interface Props {
    content: JSX.Element[]
    icon?: (isHide: boolean) => JSX.Element
    className?: string
}

function Dropdown({
    content,
    icon,
    className = ""
}: Props) {
    const [isHide, setIsHide] = useState(true);

    return (
        <div className={`dropdown ${className}`} onClick={() => setIsHide(!isHide)}>
            <button className="dropdown-btn">
                {
                    icon
                        ? icon(isHide)
                        : isHide
                            ? <ChevronUp
                                color="var(--theme)"
                            />
                            : <ChevronDown
                                color="var(--theme)"
                            />
                }
            </button>
            {
                !isHide && (
                    <nav className="dropdown-content">
                        {content}
                    </nav>
                )
            }
        </div>
    );
}

export default Dropdown;