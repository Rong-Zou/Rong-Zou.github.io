'use client';

import { useEffect, useRef } from 'react';

interface MapMyVisitorsTrackerProps {
  imageUrl: string;
  statsUrl: string;
}

export default function MapMyVisitorsTracker({ imageUrl, statsUrl }: MapMyVisitorsTrackerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !imageUrl) return;

    container.innerHTML = '';

    const link = document.createElement('a');
    link.href = statsUrl || 'https://mapmyvisitors.com/';
    link.title = 'Visit tracker';
    link.tabIndex = -1;
    link.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = '';
    image.width = 1;
    image.height = 1;

    link.appendChild(image);
    container.appendChild(link);
  }, [imageUrl, statsUrl]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
    />
  );
}
