import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase/config";
import type { GuestMessage } from "../types";

const col = (weddingId: string) => collection(db, "weddings", weddingId, "messages");

export function subscribeAllMessages(weddingId: string, cb: (msgs: GuestMessage[]) => void) {
  const q = query(col(weddingId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as GuestMessage)));
  });
}

export function subscribeApprovedMessages(weddingId: string, cb: (msgs: GuestMessage[]) => void) {
  const q = query(col(weddingId), where("status", "==", "approved"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as GuestMessage)));
  });
}

export async function submitMessage(
  weddingId: string,
  data: { name: string; message: string; attendanceStatus: GuestMessage["attendanceStatus"] }
) {
  await addDoc(col(weddingId), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function setMessageStatus(
  weddingId: string,
  messageId: string,
  status: GuestMessage["status"]
) {
  await updateDoc(doc(db, "weddings", weddingId, "messages", messageId), { status });
}

export async function deleteMessage(weddingId: string, messageId: string) {
  await deleteDoc(doc(db, "weddings", weddingId, "messages", messageId));
}
