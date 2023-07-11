import * as React from "react"
import { SVGProps } from "react"
interface SVGRProps {
    title?: string;
    titleId?: string;
}

const BackupIcon = ({
    title,
    titleId,
    ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
    <svg
        height="1em"
        viewBox="0 0 64 64"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby={titleId}
        {...props}
    >
        {title ? <title id={titleId}>{title}</title> : null}
        <path d="M51.32 51.84A28.497 28.497 0 0 1 30.41 61c-6.67 0-13-2.29-18.07-6.5l2.53.02h.01a.969.969 0 0 0 .01-1.94l-5.01-.03a.96.96 0 0 0-.71.3c-.18.2-.28.46-.26.73l.33 5c.03.51.46.91.97.91h.07c.53-.04.94-.5.9-1.03L11 55.91c5.44 4.55 12.24 7.03 19.41 7.03 8.47 0 16.62-3.57 22.34-9.79a.967.967 0 0 0-.06-1.37.967.967 0 0 0-1.37.06zM63.84 36.51c-.3-.44-.9-.56-1.35-.27l-2.12 1.42c.29-1.69.45-3.41.45-5.13 0-3.07-.46-6.11-1.36-9.05a30.069 30.069 0 0 0-6.71-11.57c-4.21-4.57-9.62-7.69-15.64-9.03-.52-.12-1.04.21-1.16.73s.21 1.04.74 1.16c5.63 1.25 10.69 4.18 14.64 8.46 2.9 3.12 5.01 6.76 6.28 10.83.85 2.75 1.28 5.59 1.28 8.47 0 1.56-.14 3.12-.4 4.66L57.24 35a.958.958 0 0 0-1.32-.36c-.47.26-.63.86-.36 1.32l2.47 4.36c.13.23.36.4.62.46.07.02.15.03.22.03.19 0 .38-.06.54-.16l4.16-2.79c.44-.3.56-.9.27-1.35zM1.94 32.53c0-2.88.43-5.73 1.28-8.47a28.68 28.68 0 0 1 6.29-10.84c3.03-3.28 6.76-5.78 10.9-7.33l-1.28 2.17a.974.974 0 0 0 .34 1.33.984.984 0 0 0 1.33-.35l2.55-4.31c.14-.23.17-.51.09-.77s-.26-.47-.5-.59l-4.49-2.22a.97.97 0 1 0-.86 1.74l2.28 1.13a30.211 30.211 0 0 0-11.79 7.89c-3.06 3.3-5.38 7.3-6.72 11.58C.46 26.42 0 29.46 0 32.53c0 3.06.46 6.1 1.36 9.04.13.42.51.68.93.68.09 0 .19-.01.29-.04.51-.16.8-.7.64-1.21-.85-2.75-1.28-5.6-1.28-8.47z" />
        <path d="M14.66 20.96v23.26a.972.972 0 0 0 .97.99h28.03a2 2 0 0 0 1.94-1.52l3.68-14.95c.15-.6.01-1.23-.37-1.71-.38-.49-.96-.77-1.57-.77h-1.9v-1.95c0-1.2-.95-2.17-2.12-2.17h-12.3c-.33 0-.64-.13-.88-.37l-2.12-2.06c-.61-.59-1.4-.92-2.24-.92h-9c-1.17 0-2.12.97-2.12 2.17zm32.68 7.23.06.08-3.74 15H16.88l3.75-15.07h26.71zM26.67 21.1l2.12 2.06c.61.59 1.4.92 2.24.92h12.3c.1 0 .18.11.18.23v1.95H20.63a2 2 0 0 0-1.94 1.52l-2.08 8.46V20.96c0-.13.08-.23.18-.23h9c.32 0 .63.13.88.37z" />
        <path d="M32.55 36.7h8.76c.54 0 .97-.43.97-.97s-.43-.97-.97-.97h-8.76a.97.97 0 0 0 0 1.94zM28.13 41.11h11.82c.54 0 .97-.43.97-.97s-.43-.97-.97-.97H28.13a.97.97 0 0 0 0 1.94z" />
    </svg>
)

export default BackupIcon