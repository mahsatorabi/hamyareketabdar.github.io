import { useEffect, useState, useCallback } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserInfo {
  name: string;
  email: string;
}

export function usePageState<T = any>(page: string, user: UserInfo) {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchState() {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "pages", page);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setState(docSnap.data().state as T);
        } else {
          setState({} as T);
        }
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchState();
  }, [page]);

  const saveState = useCallback(async (newState: T) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, "pages", page);
      await setDoc(docRef, {
        state: newState,
        lastModifiedBy: user,
        lastModifiedAt: new Date().toISOString(),
      });
      setState(newState);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [page, user]);

  return { state, setState: saveState, loading, error };
} 