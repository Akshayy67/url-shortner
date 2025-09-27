import { NextRequest, NextResponse } from "next/server";
import { createShortUrl } from "@/lib/database";
import { getClientIP } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customAlias, expiresAt } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const userIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent");

    const result = await createShortUrl({
      originalUrl: url,
      customAlias,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      userIP: userIP || undefined,
      userAgent: userAgent || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${
      result.data!.custom_alias || result.data!.short_code
    }`;

    return NextResponse.json({
      success: true,
      data: {
        ...result.data,
        shortUrl,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
