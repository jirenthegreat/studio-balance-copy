import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

/** Prosty odczyt kolekcji z bazy (panel studia). */
export function useCollection(entity, query, options) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify({ query: query || {}, options: options || {} });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.entities[entity].filter(
        query || {},
        options || { sort: "-created_date" }
      );
      setItems(Array.isArray(res) ? res : res?.items ?? []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [entity, key]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load, setItems };
}

export async function saveRecord(entity, id, data) {
  if (id) return base44.entities[entity].update(id, data);
  return base44.entities[entity].create(data);
}

export async function removeRecord(entity, id) {
  return base44.entities[entity].delete(id);
}