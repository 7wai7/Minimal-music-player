import { cloneElement, type JSX, useRef, memo, useEffect } from "react";
import "../styles/Tabs.css"

interface Props {
    tabs: {
        navBtn: JSX.Element;
        content: JSX.Element | JSX.Element[];
    }[];
}

function Tabs({ tabs }: Props) {
    const refInner = useRef<HTMLDivElement>(null);
    const refNav = useRef<HTMLElement>(null);
    const currentIndex = useRef(0);

    const showTab = (index: number) => {
        currentIndex.current = index;
        if (refInner.current) {
            refInner.current.style.transform = `translateX(-${(100 / tabs.length) * index}%)`;
        }

        const nav = refNav.current;
        if (nav) {
            nav.querySelector(".nav-btn.active")?.classList.remove("active");
            const btn = nav.querySelectorAll<HTMLButtonElement>(".nav-btn")[index];
            btn?.classList.add("active");
        }
    };

    useEffect(() => {
        showTab(0);
    }, []);

    return (
        <div className="tabs-wrapper">
            <nav ref={refNav}>
                {tabs.map((tab, index) =>
                    cloneElement(tab.navBtn, {
                        key: index,
                        className: `nav-btn ${tab.navBtn.props.className || ""}`,
                        onClick: (e: React.MouseEvent) => {
                            tab.navBtn.props.onClick?.(e);
                            showTab(index);
                        },
                    })
                )}
            </nav>

            <div
                ref={refInner}
                className="tabs-inner"
                style={{
                    width: `${100 * tabs.length}%`
                }}
            >
                {tabs.map((tab, i) => (
                    <div
                        key={i}
                        className="tab"
                        style={{
                            flexShrink: `${1 / tabs.length}%`,
                            maxWidth: `calc(100% / ${tabs.length})`
                        }}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(Tabs);
