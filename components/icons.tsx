import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function MenuIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 7h14M5 12h14M5 17h14" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function SunIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="12" cy="12" r="3.5" /><path d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" /></svg>;
}

export function MoonIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M20 15.2A8.2 8.2 0 0 1 8.8 4a8.2 8.2 0 1 0 11.2 11.2Z" /></svg>;
}

export function SystemIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
}

export function ShuffleIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M3 7h3.5c4.5 0 5 10 9.5 10H21" /><path d="m18 14 3 3-3 3M3 17h3.5c1.2 0 2.1-.7 2.9-1.7M14.5 8.7c.5-1 1-1.7 1.5-1.7h5M18 4l3 3-3 3" /></svg>;
}

export function ArrowIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}

export function BackIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M19 12H5M10 7l-5 5 5 5" /></svg>;
}

export function SearchIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
}

export function GitHubIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M15 22v-4c.1-1-.4-1.8-1-2.3 3.2-.4 6.5-1.6 6.5-7A5.5 5.5 0 0 0 19 4.9 5 5 0 0 0 18.9 1S17.7.6 15 2.5a13.4 13.4 0 0 0-6 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.9a5.5 5.5 0 0 0-1.5 3.8c0 5.4 3.3 6.6 6.5 7-.5.4-.9 1.2-1 2.3v4" /><path d="M9 19c-3 .9-3-1.5-4.2-2" /></svg>;
}

export function TemperatureIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z" /><path d="M11 8v9" /></svg>;
}

export function CupIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M4 22h14" /></svg>;
}

export function PinIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}
