import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export const useStageFavorites = (stageNumber: number) => {
  return useQuery({
    queryKey: ["stageFavorites", stageNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stage_favorites")
        .select("*")
        .eq("stage_number", stageNumber)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
