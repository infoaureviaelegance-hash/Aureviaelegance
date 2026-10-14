import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const videoUrl = new URL(request.url).searchParams.get("url");
  if (!videoUrl || videoUrl.length > 2048) {
    return NextResponse.json({ error: "A TikTok video URL is required." }, { status: 400 });
  }

  let parsedVideoUrl: URL;
  try {
    parsedVideoUrl = new URL(videoUrl);
  } catch {
    return NextResponse.json({ error: "The TikTok video URL is invalid." }, { status: 400 });
  }

  if (
    parsedVideoUrl.protocol !== "https:" ||
    !(parsedVideoUrl.hostname === "tiktok.com" || parsedVideoUrl.hostname.endsWith(".tiktok.com"))
  ) {
    return NextResponse.json({ error: "Only HTTPS TikTok video URLs are supported." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(parsedVideoUrl.toString())}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(`TikTok oEmbed returned ${response.status} while fetching a reel thumbnail`);
      return NextResponse.json({ error: "TikTok could not provide this video's thumbnail." }, { status: 502 });
    }

    const metadata: unknown = await response.json();
    if (!metadata || typeof metadata !== "object" || !("thumbnail_url" in metadata) || typeof metadata.thumbnail_url !== "string") {
      console.error("TikTok oEmbed response did not include a thumbnail URL");
      return NextResponse.json({ error: "TikTok did not provide this video's thumbnail." }, { status: 502 });
    }

    const thumbnailUrl = new URL(metadata.thumbnail_url);
    if (thumbnailUrl.protocol !== "https:") {
      console.error("TikTok oEmbed returned a non-HTTPS thumbnail URL");
      return NextResponse.json({ error: "TikTok returned an invalid thumbnail URL." }, { status: 502 });
    }

    return NextResponse.json(
      { thumbnailUrl: thumbnailUrl.toString() },
      { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Unable to fetch TikTok reel thumbnail: ${message}`);
    return NextResponse.json({ error: "Unable to fetch this video's thumbnail from TikTok." }, { status: 502 });
  }
}
