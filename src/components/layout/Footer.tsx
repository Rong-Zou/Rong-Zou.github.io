'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
  mapMyVisitorsUrl?: string;
}

function normalizeMapMyVisitorsUrl(url?: string) {
  const trimmed = (url || '').trim();
  if (!trimmed) return 'https://mapmyvisitors.com/';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return 'https://mapmyvisitors.com/';
}

export default function Footer({
  lastUpdated,
  lastUpdatedByLocale,
  defaultLocale = 'en',
  mapMyVisitorsUrl,
}: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const resolvedMapMyVisitorsUrl = normalizeMapMyVisitorsUrl(mapMyVisitorsUrl);

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-2 text-center sm:grid-cols-3 sm:items-center">
          <p className="text-xs text-neutral-500 sm:text-left">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
          <p className="text-xs text-neutral-100">
            <a
              href={resolvedMapMyVisitorsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-neutral-500 dark:hover:text-neutral-300"
            >
              {messages.footer.mapMyVisitors}
            </a>
          </p>
          <p className="text-xs text-neutral-500 sm:text-right">
            <a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer">
              {messages.footer.builtWithPrism}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
