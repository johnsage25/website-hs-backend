import * as React from "react"
import { SVGProps } from "react"

const CurvedArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height="1em"
    viewBox="0 0 64 64"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g data-name="Layer 89">
      <path d="M63.04 64a1.02 1.02 0 0 1-.135-.009c-.476-.064-47.733-6.919-55.015-51.791a1 1 0 0 1 1.975-.32c7.041 43.39 52.845 50.066 53.306 50.129A1 1 0 0 1 63.04 64z" />
      <path d="M7.942 0c2.6 5.474 6.793 12.18 10.969 16.2l-9.776-2.6-9.173 4.26C3.375 13.176 6.341 5.842 7.942 0z" />
    </g>
  </svg>
)

export default CurvedArrow
