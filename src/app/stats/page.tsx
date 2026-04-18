import { Metadata } from 'next';
import { getTomlContent } from '@/lib/content';
import StatsPageClient from '@/components/stats/StatsPageClient';
import type { StatsContent } from '@/types/stats';

export const metadata: Metadata = {
  title: 'Stats',
  description: 'Live age, birthday progress, visited cities, and time horizon stats for Rong Zou.',
};

export default function StatsPage() {
  const stats = getTomlContent<StatsContent>('stats.toml') || {
    birth_date: '2000-01-01',
    birth_date_is_placeholder: true,
    visited_cities: [],
  };

  return <StatsPageClient stats={stats} />;
}
