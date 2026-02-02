export type Stage = {
  id: number;
  stage_number: number;

  date: string;
  start_time: string;
  distance: string;
  type: string;
  image_url: string;

  stars_3: number[];
  stars_2: number[];
  stars_1: number[];
  comment?: string;

  updated_at?: string;
};
