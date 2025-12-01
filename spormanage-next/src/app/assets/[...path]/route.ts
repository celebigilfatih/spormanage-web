import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  try {
    const segments = params.path || [];
    const rel = segments.join("/");
    if (rel.includes("..")) return NextResponse.json({ error: "invalid path" }, { status: 400 });
    const filePath = path.join(process.cwd(), "..", "assets", "img", rel);
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
