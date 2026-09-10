import { ImageResponse } from "next/og";
import { SocialCardImage } from "@/components/social-card-image";
import { getCoffee } from "@/lib/coffees";

const imageSizes = {
  "1x1": { width: 1200, height: 1200 },
  "4x3": { width: 1200, height: 900 },
  "16x9": { width: 1200, height: 675 },
  social: { width: 1200, height: 630 },
} as const;
const cacheControl = "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400";

type ImageRatio = keyof typeof imageSizes;

const isImageRatio = (value: string): value is ImageRatio => value in imageSizes;

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string; ratio: string }> },
) => {
  const { slug, ratio } = await params;
  const coffee = getCoffee(slug);
  if (!coffee || !isImageRatio(ratio)) return new Response("Image not found", { status: 404 });

  const size = imageSizes[ratio];
  return new ImageResponse(
    <SocialCardImage
      accent={coffee.tone}
      description={coffee.character}
      eyebrow={`${coffee.type} recipe`}
      facts={[coffee.served, coffee.origin, `${coffee.steps.length} steps`]}
      height={size.height}
      title={coffee.name}
      width={size.width}
    />,
    { ...size, headers: { "Cache-Control": cacheControl } },
  );
};
