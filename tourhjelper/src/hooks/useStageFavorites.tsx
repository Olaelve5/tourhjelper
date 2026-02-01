import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export const useStageFavorites = (stageNumber: number) => {
  return useQuery({
    // The "Query Key". Whenever 'stageNumber' changes, it re-fetches or checks cache.
    queryKey: ["stageFavorites", stageNumber],

    // The fetch function
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", stageNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    // Config: Keep data fresh for 5 minutes, cache it for 30 minutes
    staleTime: 1000 * 60 * 5,
  });
};
