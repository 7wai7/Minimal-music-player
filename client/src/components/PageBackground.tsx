function PageBackground() {
    return (
        <div className="page-background">
            <svg width="100%" height="100%"  fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <rect width="100%" height="100%" fill="url(#pattern0_19_312)" />
                <defs>
                    <pattern id="pattern0_19_312" patternUnits="userSpaceOnUse" patternTransform="matrix(20 0 0 10 495 535)" preserveAspectRatio="none" viewBox="0 0 200 100" width="1" height="1">
                        <use xlinkHref="#pattern0_19_312_inner" transform="translate(0 -100)" />
                        <use xlinkHref="#pattern0_19_312_inner" transform="translate(100 -50)" />
                        <g id="pattern0_19_312_inner">
                            <rect width="100" height="100" transform="matrix(-1 0 0 1 100 0)" fill="url(#paint0_linear_19_312)" />
                        </g>
                        <use xlinkHref="#pattern0_19_312_inner" transform="translate(100 50)" />
                    </pattern>
                    <linearGradient id="paint0_linear_19_312" x1="50" y1="-6.92671e-06" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#393448" />
                        <stop offset="1" stopColor="#4E4764" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export default PageBackground;