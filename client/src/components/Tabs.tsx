import { useState, cloneElement, type JSX } from "react";
import "../styles/Tabs.css"

interface Props {
    tabs: {
        navBtn: JSX.Element;
        content: JSX.Element | JSX.Element[];
    }[];
}

function Tabs({ tabs }: Props) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="tabs-wrapper">
            <nav>
                {tabs.map((tab, index) =>
                    cloneElement(tab.navBtn, {
                        key: index,
                        className: `nav-btn ${index === activeTab ? "active" : ""} ${tab.navBtn.props.className || ""}`,
                        onClick: (e: React.MouseEvent) => {
                            tab.navBtn.props.onClick?.(e);
                            setActiveTab(index);
                        },
                    })
                )}
            </nav>

            <div
                className="tabs-inner"
                style={{
                    width: `${100 * tabs.length}%`,
                    transform: `translateX(-${(100 / tabs.length) * activeTab}%)`
                }}
            >
                {tabs.map((tab, i) => (
                    <div key={i} className="tab">
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tabs;
