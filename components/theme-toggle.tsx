"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, SystemIcon } from "./icons";

const order = ["system", "light", "dark"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const current = mounted && order.includes(theme as (typeof order)[number]) ? theme! : "system";
  const next = order[(order.indexOf(current as (typeof order)[number]) + 1) % order.length];
  const label = `Theme: ${current}. Switch to ${next}.`;

  return (
    <button className="icon-button theme-toggle" type="button" aria-label={label} title={label} onClick={() => setTheme(next)}>
      {!mounted || current === "system" ? <SystemIcon /> : current === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
