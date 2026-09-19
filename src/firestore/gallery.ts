import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase/config";
import type { GalleryImage } from "../types";

const col = (weddingId: string) => collection(db, "weddings", weddingId, "gallery");

export function subscribeGallery(weddingId: string, cb: (images: GalleryImage[]) => void) {
  const q = query(col(weddingId), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as GalleryImage)));
  });
}

export async function addGalleryImage(
  weddingId: string,
  data: { imageUrl: string; publicId: string; caption?: string; order: number }
) {
  await addDoc(col(weddingId), { ...data, createdAt: serverTimestamp() });
}

export async function updateGalleryImage(weddingId: string, imageId: string, data: Partial<GalleryImage>) {
  await updateDoc(doc(db, "weddings", weddingId, "gallery", imageId), data);
}

export async function deleteGalleryImage(weddingId: string, imageId: string) {
  await deleteDoc(doc(db, "weddings", weddingId, "gallery", imageId));
}
