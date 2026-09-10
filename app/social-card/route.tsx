import { ImageResponse } from "next/og";
import { SocialCardImage } from "@/components/social-card-image";
import { coffees } from "@/lib/coffees";

const size = { width: 1200, height: 630 } as const;
const cacheControl = "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400";

export const GET = () => new ImageResponse(
  <SocialCardImage
    accent="#8b4f2d"
    description="Spin the coffee picker, discover a drink, and follow a short recipe."
    eyebrow="Coffee discovery"
    facts={[`${coffees.length} recipes`, "Free", "Open source"]}
    height={size.height}
    title="What coffee should I make?"
    width={size.width}
  />,
  { ...size, headers: { "Cache-Control": cacheControl } },
);
