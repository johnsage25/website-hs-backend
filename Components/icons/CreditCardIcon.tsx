import * as React from "react"
import { SVGProps } from "react"
const CreditCardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"

    viewBox="0 0 512 512"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M53.333 85.333h405.333c29.455 0 53.333 23.878 53.333 53.333v234.667c0 29.455-23.878 53.333-53.333 53.333H53.333C23.878 426.667 0 402.789 0 373.333V138.667c0-29.456 23.878-53.334 53.333-53.334z"
      style={{
        fill: "#2196f3",
      }}
    />
    <path
      d="M0 149.333h512v85.333H0z"
      style={{
        fill: "#455a64",
      }}
    />
    <path
      d="M160 320H74.667C68.776 320 64 315.224 64 309.333s4.776-10.667 10.667-10.667H160c5.891 0 10.667 4.776 10.667 10.667S165.891 320 160 320zM224 362.667H74.667C68.776 362.667 64 357.891 64 352s4.776-10.667 10.667-10.667H224c5.891 0 10.667 4.776 10.667 10.667s-4.776 10.667-10.667 10.667z"
      style={{
        fill: "#fafafa",
      }}
    />
  </svg>
)
export default CreditCardIcon
