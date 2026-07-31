import { useCallback, useEffect, useState } from "react";
import { getMyPlan } from "../../api/planApi";

export function useMyPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await getMyPlan();
      if (res.success) setPlan(res.data);
    } catch (err) {
      console.error("Failed to load plan", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { plan, loading, refresh };
}
