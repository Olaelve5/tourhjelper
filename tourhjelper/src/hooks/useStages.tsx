import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Stage } from "@/types/Stage";

export const useStages = () => {
  return useQuery({
    queryKey: ["allStages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stages")
        .select("*")
        .order("stage_number", { ascending: true });

      if (error) throw error;
      return data as Stage[];
    },
    // Cache for a long time (e.g., 1 hour) since stage data changes rarely
    staleTime: 1000 * 60 * 60,
  });
};
