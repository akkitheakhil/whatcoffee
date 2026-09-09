import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WhatCoffee",
    short_name: "WhatCoffee",
    description: "Spin for a coffee and learn how to make it.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcf8f1",
    theme_color: "#2b1d16",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
