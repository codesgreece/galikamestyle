import { NextResponse } from "next/server";
import { getMediaById } from "@/services/media";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const asset = await getMediaById(id);
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (asset.blob?.data) {
    const bytes = Uint8Array.from(asset.blob.data);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": asset.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const stored = await getStorage().get(asset.storageKey);
  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(stored.buffer), {
    headers: {
      "Content-Type": stored.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
