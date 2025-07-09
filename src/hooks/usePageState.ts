import { useEffect, useState, useCallback } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserInfo {
  name: string;
  email: string;
}

// تابع کمکی برای حذف عمیق فیلدهای undefined
function removeUndefinedFieldsDeep<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map(item => removeUndefinedFieldsDeep(item)) as any;
  } else if (typeof data === 'object' && data !== null) {
    const obj: any = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        obj[key] = removeUndefinedFieldsDeep(data[key]);
      }
    }
    return obj;
  }
  return data;
}

export function usePageState<T = any>(collection: string, user: UserInfo) {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchState() {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, collection, "shared");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setState(docSnap.data().state as T);
        } else {
          setState([] as T);
        }
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchState();
  }, [collection]);

  const saveState = useCallback(async (newState: T) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collection, "shared");
      const cleanState = removeUndefinedFieldsDeep(newState);
      await setDoc(docRef, {
        state: cleanState,
        lastModifiedBy: user,
        lastModifiedAt: new Date().toISOString(),
      });
      setState(newState);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [collection, user]);

  return { state, setState: saveState, loading, error };
}