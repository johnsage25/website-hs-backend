import * as React from "react"
import { SVGProps } from "react"
interface SVGRProps {
  title?: string;
  titleId?: string;
}

const GoogleIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 10 10"
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
      d="M0 7h24v10H0z"
      transform="matrix(.41667 0 0 1 0 -7)"
    />
    <path
      d="M8.079 11.7c0-.281-.023-.561-.071-.838H4.121v1.587h2.226a1.905 1.905 0 0 1-.823 1.252v1.031h1.329c.778-.716 1.226-1.777 1.226-3.032Z"
      style={{
        fill: "#4285f4",
        fillRule: "nonzero",
      }}
      transform="translate(1 -7)"
    />
    <path
      d="M4.121 15.728c1.112 0 2.049-.365 2.732-.995l-1.329-1.031c-.37.251-.846.394-1.403.394-1.075 0-1.987-.725-2.314-1.701H.439v1.062a4.125 4.125 0 0 0 3.682 2.271Z"
      style={{
        fill: "#34a853",
        fillRule: "nonzero",
      }}
      transform="translate(1 -7)"
    />
    <path
      d="M1.808 12.395a2.464 2.464 0 0 1 0-1.578V9.756H.439a4.124 4.124 0 0 0 0 3.702l1.369-1.063Z"
      style={{
        fill: "#fbbc04",
        fillRule: "nonzero",
      }}
      transform="translate(1 -7)"
    />
    <path
      d="M4.121 9.117a2.244 2.244 0 0 1 1.581.618l1.177-1.176a3.97 3.97 0 0 0-2.758-1.074A4.125 4.125 0 0 0 .439 9.756l1.369 1.062c.326-.977 1.238-1.701 2.313-1.701Z"
      style={{
        fill: "#ea4335",
        fillRule: "nonzero",
      }}
      transform="translate(1 -7)"
    />
  </svg>
)

export default GoogleIcon
