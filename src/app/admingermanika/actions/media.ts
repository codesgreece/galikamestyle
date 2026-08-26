"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireApiSession } from "@/lib/auth/session";
import { CACHE_TAGS } from "@/lib/constants";
import { mediaAltSchema, type ActionResult } from "@/validations";
import {
  deleteMedia,
  updateMediaAlt,
  uploadMedia,
} from "@/services/media";
import { logActivity } from "@/services/activity";

function revalidateMedia() {
  updateTag(CACHE_TAGS.media);
  revalidatePath("/admingermanika/media");
  revalidatePath("/admingermanika/blog");
  revalidatePath("/admingermanika/dashboard");
}

export async function uploadMediaAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; storagePath: string }>> {
  const session = await requireApiSession();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Δεν επιλέχθηκε αρχείο." };
  }

  const altRaw = formData.get("altText");
  const altParsed = mediaAltSchema.safeParse({
    altText: typeof altRaw === "string" ? altRaw : null,
  });
  if (!altParsed.success) {
    return { ok: false, error: "Μη έγκυρο alt text." };
  }

  try {
    const asset = await uploadMedia({
      file,
      uploadedById: session.user.id,
      altText: altParsed.data.altText,
    });
    await logActivity({
      userId: session.user.id,
      action: "MEDIA_UPLOADED",
      summary: `Ανέβασες εικόνα «${asset.originalName}»`,
      meta: { mediaId: asset.id },
    });
    revalidateMedia();
    return {
      ok: true,
      data: { id: asset.id, storagePath: asset.storagePath },
      message: "Η εικόνα ανέβηκε.",
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Αποτυχία ανεβάσματος.",
    };
  }
}

export async function updateMediaAltAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireApiSession();
  const parsed = mediaAltSchema.safeParse({
    altText: formData.get("altText"),
  });
  if (!parsed.success) return { ok: false, error: "Μη έγκυρο alt text." };

  await updateMediaAlt(id, parsed.data.altText ?? null);
  await logActivity({
    userId: session.user.id,
    action: "MEDIA_UPDATED",
    summary: "Ενημέρωσες alt text εικόνας",
    meta: { mediaId: id },
  });
  revalidateMedia();
  return { ok: true, message: "Το alt text αποθηκεύτηκε." };
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  const session = await requireApiSession();
  await deleteMedia(id);
  await logActivity({
    userId: session.user.id,
    action: "MEDIA_DELETED",
    summary: "Διέγραψες εικόνα από τη βιβλιοθήκη",
    meta: { mediaId: id },
  });
  revalidateMedia();
  return { ok: true, message: "Η εικόνα διαγράφηκε." };
}
