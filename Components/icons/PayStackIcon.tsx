import * as React from "react"
import { SVGProps } from "react"
interface SVGRProps {
  title?: string;
  titleId?: string;
}

const PayStackIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 29 33"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      style={{
        fill: "none",
      }}
      d="M-2-3h148v33H-2z"
      transform="matrix(.19595 0 0 1 .392 3)"
    />
    <path
      d="M21.87.1H1.286C.576.1 0 .676 0 1.386v2.287c0 .71.576 1.287 1.286 1.287H21.87c.711 0 1.287-.576 1.287-1.287V1.386C23.157.676 22.581.1 21.87.1Z"
      style={{
        fill: "#09a5db",
        fillRule: "nonzero",
      }}
      transform="translate(2 3.742)"
    />
    <path
      d="M21.87.1H1.286C.576.1 0 .675 0 1.386v2.288c0 .709.576 1.285 1.286 1.285H21.87c.711 0 1.287-.576 1.287-1.285V1.386C23.157.676 22.581.1 21.87.1Z"
      style={{
        fill: "#09a5db",
        fillRule: "nonzero",
      }}
      transform="translate(2 16.503)"
    />
    <path
      d="M12.865.1H1.286C.576.1 0 .676 0 1.387v2.287c0 .71.576 1.286 1.286 1.286h11.579c.71 0 1.286-.576 1.286-1.286V1.386C14.151.68 13.571.1 12.866.1h-.001Z"
      style={{
        fill: "#09a5db",
        fillRule: "nonzero",
      }}
      transform="translate(2 22.882)"
    />
    <path
      d="M23.158.1H1.286C.576.1 0 .676 0 1.386v2.288C0 4.383.576 4.96 1.286 4.96h21.871c.711 0 1.285-.576 1.285-1.286V1.386c0-.71-.574-1.286-1.284-1.286Z"
      style={{
        fill: "#09a5db",
        fillRule: "nonzero",
      }}
      transform="translate(2 10.122)"
    />
    <path
      d="M21.87.1H1.286C.576.1 0 .676 0 1.386v2.287c0 .71.576 1.287 1.286 1.287H21.87c.711 0 1.287-.576 1.287-1.287V1.386C23.157.676 22.581.1 21.87.1Z"
      style={{
        fill: "#09a5db",
        fillRule: "nonzero",
      }}
      transform="translate(2 3.742)"
    />
  </svg>
)

export default PayStackIcon
