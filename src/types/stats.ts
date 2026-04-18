export interface StatsCounter {
  label: string;
  value: number;
  note?: string;
}

export interface StatsCity {
  name: string;
  country: string;
  category: string;
  lat?: number;
  lng?: number;
  start?: string;
  end?: string;
  note?: string;
}

export interface StatsMilestone {
  date: string;
  title: string;
  description: string;
}

export interface LifeExpectancyStats {
  china_men?: number;
  europe_men?: number;
  china_oldest_man?: number;
  world_oldest_man?: number;
  data_year?: number;
  note?: string;
  china_men_url?: string;
  europe_men_url?: string;
  china_oldest_man_url?: string;
  world_oldest_man_url?: string;
}

export interface StatsContent {
  birth_date: string;
  birth_date_is_placeholder?: boolean;
  summary?: {
    headline?: string;
    subheading?: string;
    research_focus?: string;
    current_base?: string;
    favorite_axis?: string;
  };
  life_expectancy?: LifeExpectancyStats;
  visited_cities?: StatsCity[];
  counters?: StatsCounter[];
  cities?: StatsCity[];
  milestones?: StatsMilestone[];
}
