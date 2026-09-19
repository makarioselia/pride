import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase/config";
import type { Wedding } from "../types";

const weddingsCol = collection(db, "weddings");

export async function getWeddingBySlug(slug: string): Promise<Wedding | null> {
  const q = query(weddingsCol, where("slug", "==", slug), where("published", "==", true), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as any) } as Wedding;
}

export async function getWeddingByOwner(ownerUid: string): Promise<Wedding | null> {
  const q = query(weddingsCol, where("ownerUid", "==", ownerUid), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as any) } as Wedding;
}

export async function getWeddingById(id: string): Promise<Wedding | null> {
  const d = await getDoc(doc(db, "weddings", id));
  if (!d.exists()) return null;
  return { id: d.id, ...(d.data() as any) } as Wedding;
}

export async function createWedding(id: string, data: Partial<Wedding>) {
  await setDoc(doc(db, "weddings", id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateWedding(id: string, data: Partial<Wedding>) {
  await updateDoc(doc(db, "weddings", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(weddingsCol, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return false;
  if (excludeId && snap.docs[0].id === excludeId) return false;
  return true;
}
