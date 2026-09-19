import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase/config";
import type { WeddingEvent } from "../types";

const col = (weddingId: string) => collection(db, "weddings", weddingId, "events");

export function subscribeEvents(
  weddingId: string,
  cb: (events: WeddingEvent[]) => void
) {
  const q = query(col(weddingId), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as WeddingEvent)));
  });
}

export async function addEvent(weddingId: string, data: Omit<WeddingEvent, "id">) {
  await addDoc(col(weddingId), data);
}

export async function updateEvent(weddingId: string, eventId: string, data: Partial<WeddingEvent>) {
  await updateDoc(doc(db, "weddings", weddingId, "events", eventId), data);
}

export async function deleteEvent(weddingId: string, eventId: string) {
  await deleteDoc(doc(db, "weddings", weddingId, "events", eventId));
}
