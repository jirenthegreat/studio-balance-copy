import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.entities.StudioSettings.list({ limit: 1 });
      const list = Array.isArray(res) ? res : res?.items ?? [];
      if (list.length) {
        setSettings(list[0]);
      } else {
        const created = await base44.entities.StudioSettings.create({
          cancellation_hours: 12,
          default_capacity: 4,
        });
        setSettings(created);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (patch) => {
    if (!settings?.id) return null;
    const updated = await base44.entities.StudioSettings.update(settings.id, patch);
    setSettings(updated);
    return updated;
  };

  return { settings, loading, save, reload: load };
}