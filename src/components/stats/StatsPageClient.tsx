'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { StatsCity, StatsContent } from '@/types/stats';

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

type LocatedCity = StatsCity & {
  lat: number;
  lng: number;
};

interface Horizon {
  key: string;
  label: string;
  targetAge: number;
  note: string;
  url?: string;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string) => LeafletMarker;
  on: (event: string, handler: () => void) => LeafletMarker;
}

interface LeafletMap {
  attributionControl?: {
    setPrefix: (prefix: string | false) => void;
  };
  getZoom: () => number;
  invalidateSize: () => void;
  remove: () => void;
  setView: (center: [number, number], zoom: number, options?: { animate?: boolean }) => LeafletMap;
}

interface LeafletNamespace {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  marker: (latLng: [number, number]) => LeafletMarker;
  tileLayer: (
    url: string,
    options?: Record<string, unknown>
  ) => {
    addTo: (map: LeafletMap) => void;
  };
}

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_Z_INDEX_STYLE_ID = 'stats-leaflet-z-index-fix';

interface StatsPageClientProps {
  stats: StatsContent;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days.toLocaleString()}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatYears(years: number) {
  if (!Number.isFinite(years)) return '0.00 years';
  return `${Math.max(0, years).toFixed(2)} years`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hasCoordinates(city: StatsCity): city is LocatedCity {
  return (
    typeof city.lat === 'number' &&
    typeof city.lng === 'number' &&
    Number.isFinite(city.lat) &&
    Number.isFinite(city.lng) &&
    city.lat >= -90 &&
    city.lat <= 90 &&
    city.lng >= -180 &&
    city.lng <= 180
  );
}

function getBirthdayProgress(now: number, birthDate: string) {
  const birth = new Date(birthDate);

  if (!Number.isFinite(birth.getTime())) {
    return {
      percent: 0,
      nextBirthday: null,
      remainingMs: 0,
    };
  }

  const today = new Date(now);
  const month = birth.getMonth();
  const day = birth.getDate();
  let lastBirthday = new Date(today.getFullYear(), month, day).getTime();

  if (lastBirthday > now) {
    lastBirthday = new Date(today.getFullYear() - 1, month, day).getTime();
  }

  const nextBirthday = new Date(new Date(lastBirthday).getFullYear() + 1, month, day).getTime();
  const span = nextBirthday - lastBirthday;
  const elapsed = now - lastBirthday;

  return {
    percent: span > 0 ? clamp((elapsed / span) * 100, 0, 100) : 0,
    nextBirthday,
    remainingMs: Math.max(0, nextBirthday - now),
  };
}

function formatDate(timestamp: number | null) {
  if (!timestamp) return 'Unknown';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

function makeMapsUrl(city: LocatedCity) {
  return `https://www.google.com/maps/search/?api=1&query=${city.lat},${city.lng}`;
}

function countryCodeToFlagEmoji(countryCode: string) {
  const upper = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return '\ud83c\udff3\ufe0f';

  const chars = [...upper].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...chars);
}

function getCountryCode(countryName: string) {
  const normalized = countryName.trim().toLowerCase();
  const countryCodeByName: Record<string, string> = {
    china: 'CN',
    switzerland: 'CH',
    'united kingdom': 'GB',
    'united states': 'US',
    germany: 'DE',
    france: 'FR',
    luxembourg: 'LU',
    liechtenstein: 'LI',
    italy: 'IT',
    portugal: 'PT',
    spain: 'ES',
    japan: 'JP',
    singapore: 'SG',
    malaysia: 'MY',
    thailand: 'TH',
    'south korea': 'KR',
    korea: 'KR',
    canada: 'CA',
    australia: 'AU',
    austria: 'AT',
    netherlands: 'NL',
    belgium: 'BE',
    ireland: 'IE',
    denmark: 'DK',
    sweden: 'SE',
    norway: 'NO',
    finland: 'FI',
    poland: 'PL',
    czechia: 'CZ',
    'czech republic': 'CZ',
    hungary: 'HU',
    greece: 'GR',
    turkey: 'TR',
    vietnam: 'VN',
    indonesia: 'ID',
    india: 'IN',
    mexico: 'MX',
    argentina: 'AR',
    brazil: 'BR',
    'new zealand': 'NZ',
    uae: 'AE',
    'united arab emirates': 'AE',
  };

  return countryCodeByName[normalized] || null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const replacements: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return replacements[char] || char;
  });
}

function ensureLeafletStyles() {
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }

  if (document.getElementById(LEAFLET_Z_INDEX_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = LEAFLET_Z_INDEX_STYLE_ID;
  style.textContent = `
    .stats-leaflet-map .leaflet-pane { z-index: 1 !important; }
    .stats-leaflet-map .leaflet-tile-pane { z-index: 1 !important; }
    .stats-leaflet-map .leaflet-overlay-pane { z-index: 2 !important; }
    .stats-leaflet-map .leaflet-shadow-pane { z-index: 3 !important; }
    .stats-leaflet-map .leaflet-marker-pane { z-index: 4 !important; }
    .stats-leaflet-map .leaflet-tooltip-pane { z-index: 5 !important; }
    .stats-leaflet-map .leaflet-popup-pane { z-index: 6 !important; }
    .stats-leaflet-map .leaflet-top,
    .stats-leaflet-map .leaflet-bottom { z-index: 7 !important; }
  `;
  document.head.appendChild(style);
}

function loadLeaflet() {
  return new Promise<LeafletNamespace>((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    ensureLeafletStyles();

    const existingScript = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    const script =
      existingScript instanceof HTMLScriptElement ? existingScript : document.createElement('script');

    const handleLoad = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error('Leaflet loaded without a global L object.'));
      }
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', () => reject(new Error('Leaflet failed to load.')), {
      once: true,
    });

    if (!existingScript) {
      script.src = LEAFLET_JS;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export default function StatsPageClient({
  stats,
}: StatsPageClientProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const birthTime = useMemo(() => new Date(stats.birth_date).getTime(), [stats.birth_date]);
  const ageMs = Number.isFinite(birthTime) ? Math.max(0, now - birthTime) : 0;
  const ageYears = ageMs / YEAR_MS;
  const birthday = useMemo(() => getBirthdayProgress(now, stats.birth_date), [now, stats.birth_date]);
  const allVisitedCities = useMemo(
    () => stats.visited_cities || stats.cities || [],
    [stats.cities, stats.visited_cities]
  );
  const visitedCities = useMemo(
    () => allVisitedCities.filter(hasCoordinates),
    [stats.cities, stats.visited_cities]
  );
  const countriesVisited = useMemo(() => {
    const counts = new Map<string, number>();

    allVisitedCities.forEach((city) => {
      const country = city.country?.trim();
      if (!country) return;
      counts.set(country, (counts.get(country) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([country, cityCount]) => {
        const code = getCountryCode(country);
        return {
          country,
          cityCount,
          flag: code ? countryCodeToFlagEmoji(code) : '\ud83c\udff3\ufe0f',
        };
      })
      .sort((a, b) => b.cityCount - a.cityCount || a.country.localeCompare(b.country));
  }, [allVisitedCities]);
  const selectedCity = visitedCities.find((city) => city.name === selectedCityName) || visitedCities[0];
  const lifeYear = stats.life_expectancy?.data_year || 2025;
  const lifeNote =
    stats.life_expectancy?.note;
  const horizons = useMemo<Horizon[]>(() => {
    const source = stats.life_expectancy || {};
    const candidates: Array<Horizon | null> = [
      typeof source.china_men === 'number'
        ? {
            key: 'china_men',
            label: 'China men average',
            targetAge: source.china_men,
            note: `Life expectancy at birth, ${lifeYear}`,
            url: source.china_men_url,
          }
        : null,
      typeof source.europe_men === 'number'
        ? {
            key: 'europe_men',
            label: 'Europe men average',
            targetAge: source.europe_men,
            note: `Life expectancy at birth, ${lifeYear}`,
            url: source.europe_men_url,
          }
        : null,
      typeof source.china_oldest_man === 'number'
        ? {
            key: 'china_oldest_man',
            label: 'Oldest man in China',
            targetAge: source.china_oldest_man,
            note: `Recorded reference, ${lifeYear}`,
            url: source.china_oldest_man_url,
          }
        : null,
      typeof source.world_oldest_man === 'number'
        ? {
            key: 'world_oldest_man',
            label: 'Oldest man in the world',
            targetAge: source.world_oldest_man,
            note: `Recorded reference, ${lifeYear}`,
            url: source.world_oldest_man_url,
          }
        : null,
    ];

    return candidates.filter((item): item is Horizon => Boolean(item));
  }, [lifeYear, stats.life_expectancy]);

  useEffect(() => {
    let cancelled = false;

    if (!mapContainerRef.current || visitedCities.length === 0) {
      setMapStatus('ready');
      return undefined;
    }

    setMapStatus('loading');

    loadLeaflet()
      .then((leaflet) => {
        if (cancelled || !mapContainerRef.current) return;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        const center = visitedCities[0];
        const map = leaflet
          .map(mapContainerRef.current, {
            scrollWheelZoom: false,
            worldCopyJump: true,
          })
          .setView([center.lat, center.lng], visitedCities.length > 1 ? 2 : 6);

        leaflet
          .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18,
          })
          .addTo(map);

        map.attributionControl?.setPrefix(false);

        visitedCities.forEach((city) => {
          leaflet
            .marker([city.lat, city.lng])
            .addTo(map)
            .bindPopup(
              `<strong>${escapeHtml(city.name)}, ${escapeHtml(city.country)}</strong>${
                city.category ? `<br>${escapeHtml(city.category)}` : ''
              }`
            )
            .on('click', () => setSelectedCityName(city.name));
        });

        leafletMapRef.current = map;
        window.setTimeout(() => map.invalidateSize(), 0);
        setMapStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setMapStatus('error');
        }
      });

    return () => {
      cancelled = true;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [visitedCities]);

  useEffect(() => {
    if (!selectedCity || !leafletMapRef.current) return;

    leafletMapRef.current.setView(
      [selectedCity.lat, selectedCity.lng],
      Math.max(leafletMapRef.current.getZoom(), 5),
      { animate: true }
    );
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="border-b border-neutral-200 pb-5 dark:border-neutral-800"
        >
          <h1 className="font-serif text-4xl font-bold text-primary">Stats</h1>
        </motion.header>

        <section className="border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-semibold uppercase text-accent">Cities visited</p>
          <p className="mt-2 font-mono text-5xl font-semibold text-primary">
            {allVisitedCities.length.toLocaleString()}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {countriesVisited.map((item) => (
              <span
                key={item.country}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              >
                <span aria-hidden>{item.flag}</span>
                <span className="font-medium">{item.country}</span>
                <span className="font-mono text-xs text-neutral-500">{item.cityCount}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-accent">My Footprints</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_0.7fr]">
            <div className="relative isolate z-0 h-[22rem] overflow-hidden border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 sm:h-[28rem]">
              <div ref={mapContainerRef} className="stats-leaflet-map h-full w-full" />
              {mapStatus !== 'ready' && (
                <div className="absolute inset-0 grid place-items-center bg-white/85 p-6 text-center text-sm text-neutral-500 dark:bg-neutral-950/85">
                  {mapStatus === 'error'
                    ? 'The map could not load. City details are still available on the right.'
                    : 'Loading map...'}
                </div>
              )}
            </div>

            <div className="border border-neutral-200 p-5 dark:border-neutral-800">
              {selectedCity ? (
                <>
                  <p className="text-sm font-semibold uppercase text-accent">Selected city</p>
                  <h3 className="mt-2 text-2xl font-semibold text-primary">
                    {selectedCity.name}, {selectedCity.country}
                  </h3>
                  {selectedCity.category && (
                    <p className="mt-2 text-sm text-accent">{selectedCity.category}</p>
                  )}
                  {selectedCity.note && (
                    <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {selectedCity.note}
                    </p>
                  )}
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-neutral-500">Latitude</dt>
                      <dd className="font-mono text-primary">{selectedCity.lat.toFixed(4)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Longitude</dt>
                      <dd className="font-mono text-primary">{selectedCity.lng.toFixed(4)}</dd>
                    </div>
                  </dl>
                  <a
                    href={makeMapsUrl(selectedCity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-10 items-center border border-neutral-300 px-4 text-sm font-semibold text-primary transition hover:border-accent hover:text-accent dark:border-neutral-700"
                  >
                    Open in Google Maps
                  </a>
                </>
              ) : (
                <p className="text-sm text-neutral-500">
                  Add a city with latitude and longitude in{' '}
                  <span className="font-mono">content/stats.toml</span> to place your first
                  marker.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-accent">Current age</p>
              <p className="mt-2 font-mono text-4xl font-semibold text-primary sm:text-5xl">
                {ageYears.toFixed(9)}
              </p>
            </div>
            <p className="font-mono text-sm text-neutral-500">{formatDuration(ageMs)}</p>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold text-primary">Progress to next birthday</span>
              <span className="font-mono text-neutral-500">{birthday.percent.toFixed(4)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-md bg-accent transition-[width] duration-300"
                style={{ width: `${birthday.percent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              {/* Next birthday: {formatDate(birthday.nextBirthday)}.  */}
              Remaining:{' '}
              <span className="font-mono">{formatDuration(birthday.remainingMs)}</span>.
            </p>
          </div>

          {stats.birth_date_is_placeholder && (
            <p className="mt-4 text-sm text-neutral-500">
              This uses the placeholder birth date <span className="font-mono">{stats.birth_date}</span>.
              Replace it in <span className="font-mono">content/stats.toml</span> when you want
              the public counter to be exact.
            </p>
          )}
        </section>

        <section className="border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-accent">Time and tide wait for no man</p>
            {/* <h2 className="mt-2 font-serif text-3xl font-bold text-primary">Remaining time, gently</h2> */}
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {lifeNote}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {horizons.map((horizon) => {
              const progress = clamp((ageYears / horizon.targetAge) * 100, 0, 100);
              const remainingYears = Math.max(0, horizon.targetAge - ageYears);
              const remainingMs = remainingYears * YEAR_MS;

              return (
                <div
                  key={horizon.key}
                  className="border border-neutral-200 p-5 dark:border-neutral-800"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-primary">{horizon.label}</h3>
                      {horizon.url ? (
                        <a
                          href={horizon.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex text-sm text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition hover:text-accent hover:decoration-accent dark:decoration-neutral-700"
                        >
                          {horizon.note}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-neutral-500">{horizon.note}</p>
                      )}
                    </div>
                    <span className="font-mono text-sm text-accent">
                      {horizon.targetAge.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-md bg-accent transition-[width] duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-neutral-500">Remaining</p>
                      <p className="font-mono text-primary">{formatYears(remainingYears)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Live countdown</p>
                      <p className="font-mono text-primary">{formatDuration(remainingMs)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
