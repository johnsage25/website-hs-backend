const PackageTerms = [
  { value: "h", label: "Hourly" },
  { value: "m", label: "Mon" },
  { value: "q", label: "Qua" },
  { value: "s", label: "SemA" },
  { value: "a", label: "Yr" },
  { value: "b", label: "Bien" },
];

const LinuxImages = [
  {
    title: "Ubuntu",
    icon: "/images/os/icon-ubuntu.svg",
    description: "",
    versions: [
      { vcode: "22.04.x64", label: "22.04 LTS x64" },
      { vcode: "20.04.x64", label: "20.04.5 LTS x64" },
      { vcode: "18.04.x64", label: "18.04.4 LTS x64" },
    ],
  },
  {
    title: "Debian",
    icon: "/images/os/icon-debian.svg",
    description: "",
    versions: [
      { vcode: "22.04.x64", label: "22.04 LTS x64" },
      { vcode: "20.04.x64", label: "20.04.5 LTS x64" },
      { vcode: "18.04.x64", label: "18.04.4 LTS x64" },
    ],
  },
  {
    title: "Fedora",
    icon: "/images/os/icon-fedora.svg",
    description: "",
    versions: [
      { vcode: "22.04.x64", label: "22.04 LTS x64" },
      { vcode: "20.04.x64", label: "20.04.5 LTS x64" },
      { vcode: "18.04.x64", label: "18.04.4 LTS x64" },
    ],
  },
  {
    title: "CentOs",
    icon: "/images/os/icon-centos.svg",
    description: "",
    versions: [
      { vcode: "22.04.x64", label: "22.04 LTS x64" },
      { vcode: "20.04.x64", label: "20.04.5 LTS x64" },
      { vcode: "18.04.x64", label: "18.04.4 LTS x64" },
    ],
  },
  {
    title: "AlmaLinux",
    icon: "/images/os/icon-alma.svg",
    description: "",
    versions: [
      { vcode: "22.04.x64", label: "22.04 LTS x64" },
      { vcode: "20.04.x64", label: "20.04.5 LTS x64" },
      { vcode: "18.04.x64", label: "18.04.4 LTS x64" },
    ],
  },
  {
    title: "Rocky Linux",
    icon: "/images/os/icon-rockylinux.svg",
    description: "",
    versions: [
      { vcode: "22.04.x64", label: "22.04 LTS x64" },
      { vcode: "20.04.x64", label: "20.04.5 LTS x64" },
      { vcode: "18.04.x64", label: "18.04.4 LTS x64" },
    ],
  },
];

export { PackageTerms, LinuxImages };
