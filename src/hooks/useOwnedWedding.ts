import { useEffect, useState, useCallback } from "react";
import { collection, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { getWeddingByOwner, createWedding } from "../firestore/weddings";
import { db } from "../services/firebase/config";
import type { Wedding } from "../types";
import { THEME_PRESETS } from "../types";

export function useOwnedWedding() {
  const { user } = useAuth();
  const [wedding, setWedding] = useState<Wedding | null | undefined>(undefined);

  const load = useCallback(async () => {
    if (!user) return;
    let w = await getWeddingByOwner(user.uid);
    if (!w) {
      const id = doc(collection(db, "weddings")).id;
      const newWedding: Partial<Wedding> = {
        ownerUid: user.uid,
        slug: `wedding-${id.slice(0, 6).toLowerCase()}`,
        brideName: "Bride Name",
        groomName: "Groom Name",
        weddingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: "We're getting married! Join us as we celebrate our love.",
        heroText: "We can't wait to celebrate this special day with the people we love most.",
        published: false,
        theme: THEME_PRESETS.classic,
      };
      await createWedding(id, newWedding);
      w = { id, ...(newWedding as any) };
    }
    setWedding(w);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { wedding, reload: load, setWedding };
}
