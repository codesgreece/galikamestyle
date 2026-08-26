import { randomBytes } from "node:crypto";
import { mkdir, writeFile, unlink, readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/constants";

export type StoredObject = {
  storageKey: string;
  storagePath: string;
  filename: string;
  mimeType: string;
  size: number;
};

export type StorageProvider = {
  put(input: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<StoredObject>;
  get(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null>;
  delete(storageKey: string): Promise<void>;
};

function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "upload.bin";
}

function extensionFor(mimeType: string, originalName: string): string {
  const fromName = path.extname(originalName).toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".bin";
  }
}

export function assertValidImageUpload(file: {
  size: number;
  type: string;
  name: string;
}): void {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Επιτρέπονται μόνο εικόνες JPEG, PNG, WebP ή GIF.");
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Το αρχείο πρέπει να είναι έως 5MB.");
  }
  if (!file.name?.trim()) {
    throw new Error("Μη έγκυρο όνομα αρχείου.");
  }
}

class DatabaseStorage implements StorageProvider {
  async put(input: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<StoredObject> {
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${extensionFor(input.mimeType, input.originalName)}`;
    const storageKey = `db:${filename}`;
    return {
      storageKey,
      storagePath: `/api/media/${encodeURIComponent(storageKey)}`,
      filename,
      mimeType: input.mimeType,
      size: input.buffer.length,
    };
  }

  async get(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    const asset = await prisma.mediaAsset.findUnique({
      where: { storageKey },
      include: { blob: true },
    });
    if (!asset?.blob) return null;
    return { buffer: Buffer.from(asset.blob.data), mimeType: asset.mimeType };
  }

  async delete(storageKey: string): Promise<void> {
    // Blob cascade handled by Prisma relation when MediaAsset is deleted.
    void storageKey;
  }
}

class LocalFilesystemStorage implements StorageProvider {
  private root: string;

  constructor() {
    this.root =
      process.env.MEDIA_LOCAL_DIR ||
      path.join(process.cwd(), "storage", "uploads");
  }

  private async ensureRoot() {
    await mkdir(this.root, { recursive: true });
  }

  async put(input: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }): Promise<StoredObject> {
    await this.ensureRoot();
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${extensionFor(input.mimeType, input.originalName)}`;
    const absolute = path.join(this.root, filename);
    await writeFile(absolute, input.buffer);
    const storageKey = `local:${filename}`;
    return {
      storageKey,
      storagePath: `/api/media/${encodeURIComponent(storageKey)}`,
      filename,
      mimeType: input.mimeType,
      size: input.buffer.length,
    };
  }

  async get(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    const filename = storageKey.replace(/^local:/, "");
    const absolute = path.join(this.root, filename);
    try {
      const buffer = await readFile(absolute);
      const asset = await prisma.mediaAsset.findUnique({ where: { storageKey } });
      return {
        buffer,
        mimeType: asset?.mimeType ?? "application/octet-stream",
      };
    } catch {
      return null;
    }
  }

  async delete(storageKey: string): Promise<void> {
    const filename = storageKey.replace(/^local:/, "");
    const absolute = path.join(this.root, filename);
    await unlink(absolute).catch(() => undefined);
  }
}

let cached: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (cached) return cached;
  const mode = (process.env.MEDIA_STORAGE || "database").toLowerCase();
  cached = mode === "local" ? new LocalFilesystemStorage() : new DatabaseStorage();
  return cached;
}

export { sanitizeFilename };
