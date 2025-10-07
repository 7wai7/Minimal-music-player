import type { JSX } from "react";

interface Props {
    title?: string
}

export default function Loader({
    title = "Loading..."
}: Props): JSX.Element {
    return <div className='loading'>
        <div className='loader'></div>
        <span>{title}</span>
    </div>
}