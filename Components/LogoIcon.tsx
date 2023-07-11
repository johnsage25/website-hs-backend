import * as React from "react"
import { SVGProps } from "react"

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 89 90"
    height={36}
    width={36}
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    {...props}
  >
    <path
      style={{
        fill: "none",
      }}
      d="M224 142h89v90h-89z"
      transform="translate(-224 -142)"
    />
    <path
      d="M150 75c0 20.7-7.35 38.35-22.05 52.95C113.35 142.65 95.7 150 75 150c-20.667 0-38.35-7.35-53.05-22.05C7.317 113.35 0 95.7 0 75c0-20.7 7.317-38.4 21.95-53.1C36.65 7.3 54.333 0 75 0c20.7 0 38.35 7.3 52.95 21.9C142.65 36.6 150 54.3 150 75"
      style={{
        fill: "#00055c",
        fillRule: "nonzero",
      }}
      transform="matrix(.50601 0 0 .50601 5.6 6.6)"
    />
    <path
      d="M150 75c0 20.7-7.35 38.35-22.05 52.95C113.35 142.65 95.7 150 75 150c-20.667 0-38.35-7.35-53.05-22.05C7.317 113.35 0 95.7 0 75c0-20.7 7.317-38.4 21.95-53.1C36.65 7.3 54.333 0 75 0c20.7 0 38.35 7.3 52.95 21.9C142.65 36.6 150 54.3 150 75"
      style={{
        fill: "#4399ff",
        fillRule: "nonzero",
      }}
      transform="matrix(.46027 0 0 .46027 9.1 8.2)"
    />
    <path
      d="M150 75c0 20.7-7.35 38.35-22.05 52.95C113.35 142.65 95.7 150 75 150c-20.667 0-38.35-7.35-53.05-22.05C7.317 113.35 0 95.7 0 75c0-20.7 7.317-38.4 21.95-53.1C36.65 7.3 54.333 0 75 0c20.7 0 38.35 7.3 52.95 21.9C142.65 36.6 150 54.3 150 75"
      style={{
        fill: "url(#a)",
        fillRule: "nonzero",
      }}
      transform="matrix(.33543 0 0 .31689 17.9 9.1)"
    />
    <path
      d="M121.35 24.5c-6.567-2.6-13.5-3.9-20.8-3.9-15.133 0-28.033 5.35-38.7 16.05-10.7 10.7-16.05 23.6-16.05 38.7 0 12.2 3.667 23.2 11 33 7.167 9.433 16.483 15.917 27.95 19.45-5.5-4.267-9.783-9.533-12.85-15.8-3.2-6.433-4.8-13.233-4.8-20.4 0-12.5 4.5-23.267 13.5-32.3 9-9 19.767-13.5 32.3-13.5 14.333 0 26.017 5.5 35.05 16.5-4.133-1.833-8.717-2.75-13.75-2.75-10.067 0-18.7 3.583-25.9 10.75-7.167 7.033-10.75 15.583-10.75 25.65 0 12.067 4.817 21.767 14.45 29.1-1.7-3.067-2.55-6.583-2.55-10.55 0-6.267 2.217-11.683 6.65-16.25 4.567-4.433 9.983-6.65 16.25-6.65 7.033 0 12.917 2.75 17.65 8.25-2.3-.9-4.6-1.35-6.9-1.35-5.167 0-9.517 1.817-13.05 5.45-3.5 3.533-5.25 7.817-5.25 12.85 0 5.967 2.283 10.7 6.85 14.2H39.6c-11.9-5.5-21.433-13.75-28.6-24.75C3.667 94.817 0 82.3 0 68.7c0-18.933 6.717-35.117 20.15-48.55S49.767 0 68.7 0c10.367 0 20.217 2.217 29.55 6.65 9 4.267 16.7 10.217 23.1 17.85"
      style={{
        fill: "#00055c",
        fillRule: "nonzero",
      }}
      transform="matrix(-.37925 0 0 .37925 74.65 27.75)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={0}
        y1={0}
        x2={1}
        y2={0}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 -150 150 0 75 150)"
      >
        <stop
          offset={0}
          style={{
            stopColor: "white",
            stopOpacity: 0,
          }}
        />
        <stop
          offset={0.32}
          style={{
            stopColor: "white",
            stopOpacity: 0,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "white",
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
  </svg>
)

export default LogoIcon