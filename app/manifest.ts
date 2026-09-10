import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "WhatCoffee",
    short_name: "WhatCoffee",
    description: "Pick a coffee, browse drink recipes, and learn how to make each one at home.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fcf8f1",
    theme_color: "#2b1d16",
    lang: "en",
    categories: ["food", "lifestyle", "utilities"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
