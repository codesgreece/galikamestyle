import { prisma } from "@/lib/db";
import {
  assertValidImageUpload,
  getStorage,
  sanitizeFilename,
} from "@/lib/storage";

export async function listMediaAdmin() {
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      originalName: true,
      mimeType: true,
      size: true,
      storagePath: true,
      storageKey: true,
      altText: true,
      createdAt: true,
    },
  });
}

export async function uploadMedia(input: {
  file: File;
  uploadedById: string;
  altText?: string | null;
}) {
  assertValidImageUpload({
    size: input.file.size,
    type: input.file.type,
    name: input.file.name,
  });

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const storage = getStorage();
  const stored = await storage.put({
    buffer,
    originalName: sanitizeFilename(input.file.name),
    mimeType: input.file.type,
  });

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: stored.filename,
      originalName: sanitizeFilename(input.file.name),
      mimeType: stored.mimeType,
      size: stored.size,
      storagePath: `/api/media/by-id/`, // patched below
      storageKey: stored.storageKey,
      altText: input.altText ?? null,
      uploadedById: input.uploadedById,
      ...(process.env.MEDIA_STORAGE !== "local"
        ? {
            blob: {
              create: { data: buffer },
            },
          }
        : {}),
    },
  });

  const storagePath = `/api/media/by-id/${asset.id}`;
  return prisma.mediaAsset.update({
    where: { id: asset.id },
    data: { storagePath },
  });
}

export async function updateMediaAlt(id: string, altText: string | null) {
  return prisma.mediaAsset.update({
    where: { id },
    data: { altText },
  });
}

export async function deleteMedia(id: string) {
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;
  await getStorage().delete(asset.storageKey);
  await prisma.mediaAsset.delete({ where: { id } });
}

export async function getMediaById(id: string) {
  return prisma.mediaAsset.findUnique({
    where: { id },
    include: { blob: true },
  });
}
