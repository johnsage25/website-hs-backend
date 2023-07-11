import * as React from "react"
import { SVGProps } from "react"

const AuthyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Authy"
    viewBox="0 0 512 512"
    {...props}
  >
    <rect width={512} height={512} fill="#ec1c24" rx="15%" />
    <path
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={46}
      d="m333 131 65 65c35 36 35 96 0 134-34 34-99 36-132 4l-68-69m-19 116-65-65a97 97 0 0 1 0-134c34-35 98-36 131-4l69 69"
    />
  </svg>
)

export default AuthyIcon
