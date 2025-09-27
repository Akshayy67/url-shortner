import { NextRequest, NextResponse } from "next/server";
import { getUrlByCode, recordClick } from "@/lib/database";
import { getClientIP } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const urlData = await getUrlByCode(code);

    if (!urlData) {
      return NextResponse.redirect(new URL("/?error=not-found", request.url));
    }

    // Record the click
    const userIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");

    await recordClick(urlData.id, {
      user_ip: userIP,
      user_agent: userAgent,
      referer,
    });

    // Redirect to the original URL
    return NextResponse.redirect(urlData.original_url);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/?error=server-error", request.url));
  }
}
