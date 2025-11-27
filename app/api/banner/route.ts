import { sanityClient } from "@/lib/sanity";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "banner" && isActive == true] | order(order asc) {
      _id,
      title,
      subtitle,
      "imageUrl": image.asset->url,
      ctaText,
      ctaLink,
      mediaType,
      "video": video.asset->{
        url,
        mimeType
      },
      "videoPoster": videoPoster.asset->url,
      textPosition,
      textColor,
      buttonText,
      buttonLink,
      order,
      isActive
    }`;

    const banners = await sanityClient.fetch(query);

    return NextResponse.json(banners || []);
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}