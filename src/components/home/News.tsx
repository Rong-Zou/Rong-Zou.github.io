'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? items : items.slice(0, 3);
    const hasMore = items.length > 3;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="min-h-11 rounded-md border border-neutral-200 px-3 text-sm font-medium text-neutral-600 transition-colors hover:border-accent hover:text-accent dark:border-neutral-800 dark:text-neutral-400"
                    >
                        {expanded ? 'Show fewer' : `Show all ${items.length}`}
                    </button>
                )}
            </div>
            <motion.div
                layout
                className={expanded ? 'max-h-96 space-y-3 overflow-y-auto pr-2' : 'space-y-3'}
            >
                {visibleItems.map((item, index) => (
                    <motion.div
                        layout
                        key={`${item.date}-${index}`}
                        className="flex items-start space-x-3"
                    >
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <p className="text-sm text-neutral-700 dark:text-neutral-400">{item.content}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}
